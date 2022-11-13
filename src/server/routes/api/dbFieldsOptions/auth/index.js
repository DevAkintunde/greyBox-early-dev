import { UNAUTHORIZED } from "../../../../constants/statusCodes.js";
import { bearerTokenJwtAuth } from "../../../../middlewares/authorization/bearerTokenJwtAuth.js";
import { default as EntityStatuses } from "./EntityStatuses.js";
import { default as Roles } from "./Roles.js";

import Router from "@koa/router";
const router = new Router({
  prefix: "/auth",
});

// Check authorisation status
router.use(
  async (ctx, next) => {
    //Check if authenticated by cookie session, else do JWT auth
    //Cookie based auth is saved in cookie and managed by passportJS
    if (ctx.isUnauthenticated()) bearerTokenJwtAuth(ctx, next);

    await next();
  },
  async (ctx, next) => {
    if (ctx.isUnauthenticated()) {
      ctx.status = UNAUTHORIZED;
      return (ctx.body = { message: "Unauthorised. User not Signed In" });
    }
    await next();
  }
);

router.use(EntityStatuses.routes());
router.use(Roles.routes());

export default router;
