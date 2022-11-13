import {
  OK,
  UNAUTHORIZED,
  CREATED,
  CONFLICT,
  REDIRECTED,
  SERVICE_UNAVAILABLE,
  NOT_MODIFIED,
} from "../../../constants/statusCodes.js";
import * as formValidator from "../../../validators/adminAccountFormValidator.js";
import checkAccount from "../../../middlewares/accounts/checkAccount.js";
import * as accountController from "../../../controllers/account.controller.js";

import Router from "@koa/router";
import { mediaUpload } from "../../../middlewares/operations/mediaUpload.js";
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

router.get("/", (ctx) => {
  if (ctx.isAuthenticated) {
    ctx.status = OK;
    return (ctx.body = { status: OK, profile: ctx.state.user });
  }
  ctx.status = REDIRECTED;
  return ctx.redirect("/account");
});

// sign out account
router.get("/sign-out", (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logOut();
    ctx.status = OK;
    ctx.body = { status: 200 };
    return;
  } else {
    ctx.status = CONFLICT;
    ctx.message = "User already Signed Out";
    return;
  }
});

// account update
router.patch(
  "/update",
  async (ctx, next) => {
    await next();
    if (ctx.state.updatedUser) {
      let thisUser = { ...ctx.state.updatedUser, type: "Admin" };
      ctx.logIn(thisUser);
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        statusText: "Successful.",
        profile: ctx.state.user,
      });
    }
  },
  formValidator.updateAccount,
  mediaUpload,
  accountController.updateAccount
);

//remove account avatar
router.delete("/delete-avatar", accountController.deleteAvatar, (ctx) => {
  if (ctx.state.error) {
    ctx.status = NOT_MODIFIED;
    ctx.message = "Unable to remove avatar";
    return;
  }
  let thisUser = { ...ctx.state.updatedUser, type: "Admin" };
  ctx.logIn(thisUser);
  ctx.status = OK;
  return (ctx.body = {
    status: OK,
    statusText: "Avatar removed",
    profile: ctx.state.user,
  });
});

//account update password only
router.patch(
  "/update-password",
  formValidator.changePassword,
  accountController.updatePassword,
  (ctx) => {
    ctx.status = OK;
    return (ctx.body = {
      status: OK,
      statusText: "Password changed.",
    });
  }
);

//create new admin account
router.post(
  "/create-account",
  async (ctx, next) => {
    if (ctx.request.body && ctx.request.body.role)
      ctx.request.body.role = Number(ctx.request.body.role);
    await next();
  },
  formValidator.createAccount,
  async (ctx, next) => {
    ctx.state.userType = "Admin";
    await next();
  },
  checkAccount(false),
  async (ctx, next) => {
    if (ctx.state.error) {
      if (ctx.state.error.status === CONFLICT) {
        ctx.status = CONFLICT;
        ctx.message = "Account already registered";
        return;
      } else {
        ctx.status = ctx.state.error.status;
        ctx.message = ctx.state.error.message;
        return;
      }
    }
    await next();
  },
  accountController.createAccount,
  (ctx) => {
    if (ctx.state.newUser) {
      let profileData = {
        status: CREATED,
        profile: ctx.state.newUser.toJSON(),
        message: "Account created.",
      };
      ctx.status = OK;
      return (ctx.body = profileData);
    } else {
      ctx.status = SERVICE_UNAVAILABLE;
      ctx.message = "Account creation failed.";
      return;
    }
  }
);

export default router;
