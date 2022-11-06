import sequelize from "../config/db.config.js";
import { logger } from "../utils/logger.js";
import OTP from "../models/utils/OTP.model.js";
import { hash, compare } from "../utils/password.js";
import { generate } from "../utils/token.js";
import {
  CREATED,
  FORBIDDEN,
  SERVER_ERROR,
  OK,
  CONFLICT,
  UNAUTHORIZED,
  NOT_MODIFIED,
} from "../constants/statusCodes.js";
import { OTPcode } from "../functions/OTPcode.js";
import { markForDeletion } from "../functions/markForDeletion.js";
// models
import Admin from "../models/entities/accounts/Admin.model.js";
// modules
import bcrypt from "bcryptjs";

export const updateAccount = async (ctx) => {
  try {
    const user = await sequelize.models[ctx.state.user.type].findOne({
      where: { email: ctx.state.user.email },
    });
    if (user) {
      const updatedUser = await user.update(ctx.request.body);
      return (ctx.state.updatedUser = updatedUser.toJSON());
    }
    ctx.status = NOT_MODIFIED;
    return (ctx.body = {
      status: NOT_MODIFIED,
      message: "Unable to update account",
    });
  } catch (err) {
    ctx.status = SERVER_ERROR;
    return (ctx.body = {
      status: SERVER_ERROR,
      message: "Unable to update account.",
    });
  }
};

export const updatePassword = async (ctx) => {
  const { currentPassword, newPassword } = ctx.request.body;

  try {
    const user = await sequelize.models[ctx.state.user.type].findOne({
      where: { email: ctx.state.user.email },
    });
    if (user) {
      if (compare(currentPassword, user.dataValues.password)) {
        const hashedPassword = hash(newPassword.trim());
        await user.update({ password: hashedPassword });
        ctx.status = OK;
        return (ctx.body = {
          status: OK,
          message: "Updated",
        });
      } else {
        ctx.status = CONFLICT;
        return (ctx.body = {
          status: CONFLICT,
          message: "Incorrect current password",
        });
      }
    }
    ctx.status = NOT_MODIFIED;
    return (ctx.body = {
      status: NOT_MODIFIED,
      message: "Unable to update password",
    });
  } catch (err) {
    ctx.status = SERVER_ERROR;
    return (ctx.body = {
      status: SERVER_ERROR,
      message: "Unable to update password.",
    });
  }
};

// reset account password
export const resetPassword = async (ctx) => {
  const { email } = ctx.request.body;

  try {
    const user = await sequelize.models[ctx.state.user.type].findOne({
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
        id: data.email,
        markForDeletionBy: deletionDate,
        log: "Reset account password",
      });
      if (thisOtp instanceof OTP) {
        // implement Email sending feature here!!
      }
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        message: "Password reset",
      });
    }
    ctx.status = NOT_FOUND;
    return (ctx.body = {
      status: NOT_FOUND,
      message: "User account does not exist.",
    });
  } catch (err) {
    ctx.status = SERVER_ERROR;
    return (ctx.body = {
      status: SERVER_ERROR,
    });
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
            message:
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
    message: "Authorisation rejected.",
  });
};

//create new admin account
export const createAccount = async (ctx) => {
  const { password } = ctx.request.body;
  const hashedPassword = hash(password.trim());
  // set account for deletion if unverified after 1 days (24hrs).
  const setForUnverfiedDeletion = markForDeletion(1);
  try {
    const newUser = await sequelize.models[ctx.state.type].create({
      ...ctx.request.body,
      password: hashedPassword,
      markForDeletionBy: setForUnverfiedDeletion,
    });
    // check if user exists in the database now!
    //console.log(newUser instanceof Account); // true
    //console.log('newUser: ', newUser.toJSON());
    if (newUser && newUser.email) {
      let code = OTPcode();
      let deletionDate = markForDeletion(1);
      const thisOtp = await OTP.create({
        code: code,
        ref: ctx.state.type + " account",
        id: newUser.dataValues.email,
        markForDeletionBy: deletionDate,
        log: "New account creation",
      });
      if (thisOtp instanceof OTP) {
        // implement Email sending feature here!!
      }
      return (ctx.state.newUser = newUser);
    } else {
      logger.info(
        "Account controller: Could not verify the creation of new account as true"
      );
      return (ctx.state.error = {
        status: SERVER_ERROR,
        message: err.parent
          ? err.parent.detail
          : err.message
          ? err.message
          : "Unable to create account.",
      });
    }
  } catch (err) {
    logger.error({
      "Server error": "while trying to create new account with sequelize",
      err: err,
    });
    return (ctx.state.error = {
      status: SERVER_ERROR,
      message: err.parent
        ? err.parent.detail
        : err.message
        ? err.message
        : "Unable to create account.",
    });
  }
};
