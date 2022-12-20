"use strict";

//public account routes

import {
  OK,
  UNAUTHORIZED,
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  SERVER_ERROR,
} from "../../../constants/statusCodes.js";
import { logger } from "../../../utils/logger.js";
import * as FormValidator from "../../../validators/adminAccountFormValidator.js";
import { generate } from "../../../utils/token.js";
import { bearerTokenJwtAuth } from "../../../middlewares/authorization/bearerTokenJwtAuth.js";
import * as accountController from "../../../controllers/account.controller.js";
import checkAccount from "../../../middlewares/accounts/checkAccount.js";
import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
// model
import Admin from "../../../models/entities/accounts/Admin.model.js";
//modules
import passport from "koa-passport";
// Router
import Router from "@koa/router";
const router = new Router();

// account sign in
router.post(
  "/sign-in",
  async (ctx, next) => {
    if (!ctx.request.body) {
      ctx.status = BAD_REQUEST;
      ctx.message = "Oops! No login detail provided.";
      return;
    }
    await next();
  },
  FormValidator.signin,
  async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        profile: ctx.state.user,
        message: "Account is already Signed In.",
      });
    }
    passport.userType = "Admin"; //exported to authMiddleware
    passport.requestToken =
      ctx.header["x-requesttoken"] &&
      (ctx.header["x-requesttoken"] === "session" ||
        ctx.header["x-requesttoken"] === "token")
        ? ctx.header["x-requesttoken"]
        : null;

    return passport.authenticate("local", async (err, user, info) => {
      if (err) {
        logger.error("Error:", err);
        ctx.status = SERVER_ERROR;
        return;
      }
      if (!user) {
        ctx.status = NOT_FOUND;
        ctx.message = "Oops! Incorrect email or password";
        return;
      } else {
        //console.log("user: ", user.toJSON());
        let profileData = {
          status: OK,
          profile: { ...user.toJSON(), type: "Admin" },
        };
        if (passport.requestToken)
          if (passport.requestToken === "token") {
            const token = generate(profileData.profile);
            profileData = {
              ...profileData,
              token: token,
            };
          } else if (passport.requestToken === "session") {
            await ctx.login(profileData.profile);
          }
        ctx.status = OK;
        return (ctx.body = profileData);
      }
    })(ctx);
  }
);

//account reset password
router.post(
  "/reset-password",
  async (ctx, next) => {
    if (ctx.isAuthenticated()) {
      ctx.status = UNAUTHORIZED;
      ctx.statusText = "User already Signed In";
      return;
    }
    ctx.state.userType = "Admin";
    await next();
  },
  FormValidator.resetPassword,
  accountController.resetPassword
);

// verify account activation
// GET: /verify?filter[id=akin@thin.city]&filter[code=gjU866bi35h]
router.get(
  "/verify",
  async (ctx, next) => {
    await next();
    //console.log("query result: ", ctx.state.queryData);
    //ctx.body = ctx.state.queryData;
  },
  urlQueryTranslator,
  async (ctx, next) => {
    if (!ctx.state.queryData) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {
        status: NOT_FOUND,
        statusText: "Verification code may have expired or does not exist.",
      });
    }
    ctx.request.body = { email: ctx.state.queryData.OTP[0].id };
    await next();
  },
  checkAccount(true),
  async (ctx, next) => {
    if (ctx.state.error) {
      if (ctx.state.error.code === CONFLICT) {
        ctx.status = OK;
        return (ctx.body = {
          status: ctx.state.error.status,
          statusText: "Account already verified. Sign in to continue.",
        });
      } else if (ctx.state.error.status === NOT_FOUND) {
        ctx.status = ctx.state.error.status;
        return (ctx.body = {
          status: ctx.state.error.code,
          statusText: "Oops! Account not found",
        });
      } else {
        ctx.status = ctx.state.error.status;
        return (ctx.body = {
          status: ctx.state.error.status,
          statusText: ctx.state.error.message,
        });
      }
    }
    let verifyAccount = Admin.findByPk(ctx.state.queryData.OTP[0].id);
    await verifyAccount.update({
      status: true,
      markForDeletionBy: null,
    });
    console.log("verified Acc:", verifyAccount.toJSON());
    //if (verifyAccount.dataValues.status) {
    ctx.status = OK;
    return (ctx.body = {
      status: OK,
      statusText: "Account verified.",
    });
    //}
  }
);

// Third parties signin
router.get(
  "/signwith/:app",
  (ctx, next) => {
    if (ctx.isAuthenticated()) {
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        profile: ctx.state.user,
        message: "Account is already Signed In.",
      });
    }
    next();
  },
  async (ctx) => {
    passport.userType = "Admin";
    return passport.authenticate(ctx.params.app, {
      scope: ["profile", "email"],
    })(ctx);
  }
);

router.get(
  "/signwith/:app/callback",
  async (ctx, next) => {
    //console.log('this request: ', ctx.header)
    await next();
    //const token = generate({ profile: ctx.state.user });
    //console.log('token @google:: ', token)
    ctx.status = OK;
    return (ctx.body = {
      status: OK,
      profile: ctx.state.user,
      //token: token
    });
  },
  async (ctx) => {
    passport.userType = "Admin";
    return passport.authenticate(ctx.params.app, (err, user, info, status) => {
      if (err) {
        logger.error("Error:", err);
        ctx.status = SERVER_ERROR;
        return (ctx.body = {
          status: SERVER_ERROR,
          message: err.message,
        });
      }
      if (!user) {
        ctx.status = NOT_FOUND;
        return (ctx.body = { message: "Unable to signin using the account." });
        //ctx.throw(401);
      } else {
        //console.log("user: ", user.toJSON());
        let profileData = {
          status: OK,
          profile: { ...user.toJSON(), type: "Admin" },
        };
        if (ctx.header["x-requesttoken"] === "*") {
          const token = generate(profileData.profile);
          profileData = {
            ...profileData,
            token: token,
          };
          ctx.status = OK;
          return (ctx.body = profileData);
        } else {
          ctx.login(profileData.profile);
        }
      }
    })(ctx);
  }
);

export default router;
