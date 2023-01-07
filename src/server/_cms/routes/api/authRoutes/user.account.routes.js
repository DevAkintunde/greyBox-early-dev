/* Currently signed in user account */
import {
  OK,
  UNAUTHORIZED,
  CONFLICT,
  REDIRECTED,
  NOT_MODIFIED,
} from "../../../constants/statusCodes.js";
import * as formValidator from "../../../validators/adminAccountFormValidator.js";
import * as accountController from "../../../controllers/account.controller.js";

import Router from "@koa/router";
import { avatarUpload } from "../../../middlewares/operations/imageUpload.js";
import UserAccessTimestamps from "../../../models/utils/UserAccessTimestamps.model.js";
const router = new Router({
  prefix: "/user",
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
    //log signout of user to access stream
    UserAccessTimestamps.update(
      { signedOut: Date.now() },
      {
        where: { account_id: ctx.state.user.uuid },
      }
    );
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
  avatarUpload,
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

export default router;
