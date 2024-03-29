import Router from "@koa/router";
import { default as account } from "./publicRoutes/account/index.js";
import { default as page } from "./publicRoutes/page/index.js";
import { default as publicMedia } from "./media/index.js";
import { default as auth } from "./authRoutes/index.js";
import { default as dbFields } from "./dbFieldsOptions/index.js";
//import routes defined the extended App
import { routes as importAppExtendedRoutes } from "../../../app.config.js";

const router = new Router({
  prefix: "/api/v2",
});

// pages, anonymous account routes & other public entities routes
router.use(account.routes());
router.use(page.routes());
// public media entities routes
router.use(publicMedia.routes());

// privileged routes
router.use(auth.routes());

//misc
router.use(dbFields.routes());

//app addon routes
const appRoutes = new Router({
  prefix: "/app",
});
router.use(appRoutes.routes(), importAppExtendedRoutes.routes());

/*
// entity's privileged routes
const authorised = require("./authRoutes");
router.use(authorised.routes());

// acounts routes
const accounts = require("./accounts");
router.use(accounts.routes());
*/
export default router;
