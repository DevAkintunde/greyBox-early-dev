"use strict";
// user accounts management routes
// minimum level 3 permission.
import { UNAUTHORIZED } from "../../../constants/statusCodes.js";

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
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 3) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = {
      message: "Admin user does not have the required permission.",
    });
  }
  await next();
});

// admin accounts
import { default as admin } from "./account.type/admin.js";
router.use(admin.routes());

export default router;
