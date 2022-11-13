import sequelize from "../config/db.config.js";
import { logger } from "../utils/logger.js";
import OTP from "../models/utils/OTP.model.js";
import { hash, compare } from "../utils/password.js";
import {
  SERVER_ERROR,
  OK,
  CONFLICT,
  UNAUTHORIZED,
  NOT_MODIFIED,
  NOT_FOUND,
} from "../constants/statusCodes.js";
import { OTPcode } from "../functions/OTPcode.js";
import { markForDeletion } from "../functions/markForDeletion.js";
// models
import Admin from "../models/entities/accounts/Admin.model.js";
// modules
import bcrypt from "bcryptjs";
import fs from "node:fs";

export const updateAccount = async (ctx, next) => {
  try {
    const user = await sequelize.models[ctx.state.user.type].findOne({
      where: { email: ctx.state.user.email },
    });
    if (user) {
      let errorRemovingFormerAvatar = false;
      if (user.avatar && ctx.request.files["avatar"]) {
        fs.unlink(user.avatar, (err) => {
          if (err) errorRemovingFormerAvatar = true;
        });
      }
      if (!errorRemovingFormerAvatar && ctx.request.files["avatar"]) {
        ctx.request.body = {
          ...ctx.request.body,
          avatar: ctx.request.files["avatar"].filepath,
        };
      } else if (ctx.request.files["avatar"]) {
        fs.unlink(ctx.request.files["avatar"].filepath);
      }
      const updatedUser = await user.update(ctx.request.body);
      ctx.state.updatedUser = updatedUser.toJSON();
    } else {
      ctx.status = NOT_MODIFIED;
      ctx.message = "Unable to update account";
      return;
    }
  } catch (err) {
    ctx.status = SERVER_ERROR;
    ctx.message = "Unable to update account";
    return;
  }
  await next();
};

export const deleteAvatar = async (ctx, next) => {
  try {
    const user = await sequelize.models[ctx.state.user.type].findOne({
      where: { email: ctx.state.user.email },
    });

    if (user && user.avatar) {
      fs.unlinkSync(user.avatar, (err) => {
        if (err) ctx.state.error = err;
      });
    }
    if (!ctx.state.error) {
      await user.update({ avatar: null });
      ctx.state.updatedUser = user.toJSON();
    }
  } catch (err) {
    ctx.state.error = err;
  }
  await next();
};

export const updatePassword = async (ctx, next) => {
  const { currentPassword, newPassword } = ctx.request.body;
  try {
    const user = await sequelize.models[ctx.state.user.type]
      .scope("middleware")
      .findOne({
        where: { email: ctx.state.user.email },
      });
    if (user) {
      if (compare(currentPassword, user.dataValues.password)) {
        const hashedPassword = hash(newPassword.trim());
        await user.update({ password: hashedPassword });
      } else {
        ctx.status = CONFLICT;
        ctx.message = "Incorrect current password";
        return;
      }
    }
  } catch (err) {
    ctx.status = SERVER_ERROR;
    ctx.message = "Unable to update password";
    return;
  }
  await next();
};

// reset account password
export const resetPassword = async (ctx) => {
  const { email } = ctx.request.body;
  try {
    const user = await sequelize.models[ctx.state.userType].findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      let code = OTPcode();
      let deletionDate = markForDeletion(1);
      const thisOtp = await OTP.create({
        code: code,
        ref: "Admin user",
        id: user.email,
        markForDeletionBy: deletionDate,
        log: "Reset account password",
      });
      if (thisOtp instanceof OTP) {
        // implement Email sending feature here!!
      }
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        statusText: "Password was reset",
      });
    }
    ctx.status = NOT_FOUND;
    ctx.message = "User account does not exist.";
    return;
  } catch (err) {
    ctx.status = SERVER_ERROR;
    return;
  }
};

export const signInLocal = async (accountType, email, password, done) => {
  try {
    const user = await sequelize.models[accountType]
      .scope("middleware")
      .findOne({
        where: {
          email: email,
        },
      });
    if (user) {
      if (bcrypt.compareSync(password, user.dataValues.password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
};

export const signWithThirdParty = async (
  app,
  accountType,
  request,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  //console.log('accessToken:: ', accessToken)
  //console.log('refreshToken:: ', refreshToken)
  //console.log('profile:: ', profile)
  if (accessToken && profile) {
    try {
      let user;
      if (app === "google") {
        user = await sequelize.models[accountType].findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        if (user && user.email) {
          done(null, user);
        } else {
          done({
            status: UNAUTHORIZED,
            statusText:
              "Only privileged users are allowed to sign in using " + app,
          });
        }
      }
    } catch (err) {
      done(err);
    }
  }
  done({
    status: UNAUTHORIZED,
    statusText: "Authorisation rejected.",
  });
};

//create new admin account
export const createAccount = async (ctx, next) => {
  const { password } = ctx.request.body;
  const hashedPassword = hash(password.trim());
  // set account for deletion if unverified after 1 days (24hrs).
  const setForUnverfiedDeletion = markForDeletion(1);
  try {
    const newUser = await sequelize.models[ctx.state.userType].create({
      ...ctx.request.body,
      password: hashedPassword,
      markForDeletionBy: setForUnverfiedDeletion,
    });
    // check if user exists in the database now!
    //console.log(newUser instanceof Account); // true
    console.log("newUser: ", newUser.toJSON());
    if (newUser && newUser.email) {
      let code = OTPcode();
      let otpDeletionDate = markForDeletion(1);
      const thisOtp = await OTP.create({
        code: code,
        ref: ctx.state.userType + " account",
        id: newUser.dataValues.email,
        markForDeletionBy: otpDeletionDate,
        log: "New account creation",
      });
      if (thisOtp instanceof OTP) {
        console.log("thisOtp: ", thisOtp.toJSON());
        // implement Email sending feature here!!
      }
      ctx.state.newUser = newUser;
    } else {
      logger.info(
        "Account controller: Could not verify the creation of new account as true"
      );
      ctx.state.error = {
        status: SERVER_ERROR,
        message: "Unable to verify new account",
      };
    }
  } catch (err) {
    logger.error({
      "Server error": "while trying to create new account with sequelize",
      err: err,
    });
    ctx.state.error = {
      status: SERVER_ERROR,
      message: err.parent
        ? err.parent.detail
        : err.message
        ? err.message
        : "Unable to create account",
    };
  }
  await next();
};
