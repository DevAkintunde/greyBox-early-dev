import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
import {
  OK,
  UNAUTHORIZED,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} from "../../../constants/statusCodes.js";
import { bearerTokenJwtAuth } from "../../../middlewares/authorization/bearerTokenJwtAuth.js";
import * as formValidator from "../../../validators/adminAccountFormValidator.js";
import checkAccount from "../../../middlewares/accounts/checkAccount.js";
import * as accountController from "../../../controllers/account.controller.js";
import sequelize from "../../../config/db.config.js";

import Router from "@koa/router";
const router = new Router({
  prefix: "/account",
});
/*
Role definations:
    0. inactive role/null
    1. probation
    2. staff (staff and client officers)
    3. manager
    4. executive
    5. dev
*/

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 1) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = {
      message: "User does not have the required permission.",
    });
  }
  await next();
});

router.get(
  "/",
  async (ctx, next) => {
    console.log("justing checking");
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[created=ASC]&page[limit=25]";
    }
    await next();
  },
  urlQueryTranslator,
  (ctx) => {
    //console.log('response',ctx.state.queryData)
    if (ctx.state.queryData) {
      ctx.status = OK;
      return (ctx.body = ctx.state.queryData);
    }
    return (ctx.status = BAD_REQUEST);
  }
);

// sign out account
router.delete("/signout", bearerTokenJwtAuth, (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logOut();
    ctx.status = OK;
    return (ctx.body = { message: "Successful" });
  } else {
    ctx.status = CONFLICT;
    return (ctx.body = { message: "User already Signed Out" });
  }
});

// account update
router.patch(
  "/update",
  bearerTokenJwtAuth,
  async (ctx, next) => {
    if (ctx.isUnauthenticated()) {
      ctx.status = UNAUTHORIZED;
      return (ctx.body = { message: "Unauthorised. User not Signed In" });
    }
    await next();
    if (ctx.state.updatedUser) {
      ctx.logIn({ ...ctx.state.updatedUser, type: "Admin" });
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        message: "Successful.",
        profile: ctx.state.user,
      });
    }
  },
  formValidator.updateAccount,
  accountController.updateAccount
);
//account update password only
router.patch(
  "/update-password",
  bearerTokenJwtAuth,
  async (ctx, next) => {
    if (ctx.isUnauthenticated()) {
      ctx.status = UNAUTHORIZED;
      return (ctx.body = { message: "Unauthorised. User not Signed In" });
    }
    await next();
  },
  formValidator.changePassword,
  accountController.updatePassword
);

//create new admin account
router.post(
  "/create-account",
  formValidator.createAccount,
  checkAccount(false),
  async (ctx, next) => {
    console.log("hello 112222");
    if (ctx.state.error) {
      if (ctx.state.error.code === CONFLICT) {
        ctx.status = CONFLICT;
        return (ctx.body = {
          status: CONFLICT,
          message: "Conflict. Account already registered.",
        });
      } else {
        ctx.status = ctx.state.error.code;
        return (ctx.body = {
          status: ctx.state.error.code,
          message: ctx.state.error.message,
        });
      }
    }

    await next();
    //console.log('uuuuuuse:: ', ctx.state.newUser)
    if (ctx.state.newUser) {
      console.log("new user: ", ctx.state.newUser.toJSON());
      let profileData = {
        status: CREATED,
        profile: ctx.state.newUser.toJSON(),
        message: "Account created.",
      };
      ctx.status = OK;
      return (ctx.body = profileData);
    } else {
      ctx.status = SERVER_ERROR;
      return (ctx.body = {
        status: SERVER_ERROR,
        message: "Account creation failed.",
      });
    }
  },
  accountController.createAccount
);

export default router;
