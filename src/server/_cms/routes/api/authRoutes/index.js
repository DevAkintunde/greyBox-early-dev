import { UNAUTHORIZED, OK } from "../../../constants/statusCodes.js";
import { bearerTokenJwtAuth } from "../../../middlewares/authorization/bearerTokenJwtAuth.js";
import { default as user } from "./user.account.routes.js";
import { default as accounts } from "./accounts.routes.js";
import { default as authMedia } from "./media/index.js";
import { default as misc } from "./misc/index.js";
import { default as bin } from "./bin.route.js";
//unspecific entity routes which will carter for node entities like pages and blog articles
import { default as nodesRoutes } from "./nodes.routes.js";

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

// currently signed in user account
router.use(user.routes());
//auth media routes
router.use(authMedia.routes());
//miscellaneous routes
router.use(misc.routes());
// all accounts routes condensed in one router @ /account
router.use(accounts.routes());
//recycle bin routes
router.use(bin.routes());

// All nodes entity's routes
router.use(nodesRoutes.routes());

// Entity creation endpoints for dev purposes
/* import { default as entityCreate } from "./createEndpoints";
router.use(entityCreate.routes()); */

export default router;
