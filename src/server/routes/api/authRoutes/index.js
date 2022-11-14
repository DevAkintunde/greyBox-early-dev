import { UNAUTHORIZED, OK } from "../../../constants/statusCodes.js";
import { bearerTokenJwtAuth } from "../../../middlewares/authorization/bearerTokenJwtAuth.js";
import { default as pages } from "./pages.js";
import { default as account } from "./account.js";
import { default as authMedia } from "./media/index.js";

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

// Signed In landing page
router.get("/", (ctx) => {
  return (ctx.body = { status: OK, profile: ctx.state.user });
});

//list available auth paths
router.get("/paths", (ctx) => {
  let availableRoutes = {
    page: "/pages, /page/*",
    account: "/account, /account/*",
    createEntity: "/createEndpoints",
  };
  ctx.status = OK;
  return (ctx.body = availableRoutes);
});

// pages
router.use(pages.routes());
// all accounts routes condensed in one router @ /account
router.use(account.routes());
//auth media routes
router.use(authMedia.routes());

// Entity creation endpoints for dev purposes
/* import { default as entityCreate } from "./createEndpoints";
router.use(entityCreate.routes()); */

export default router;
