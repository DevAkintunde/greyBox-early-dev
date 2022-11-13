import Router from "@koa/router";
import { default as account } from "./account/index.js";
import { default as page } from "./page/index.js";
import { default as media } from "./media/index.js";
import { default as auth } from "./authRoutes/index.js";
import { default as dbFields } from "./dbFieldsOptions/index.js";

const router = new Router({
  prefix: "/api/v2",
});

// pages, anonymous account routes & other public entities routes
router.use(account.routes());
router.use(page.routes());
// media entities routes
router.use(media.routes());

// privileged routes
router.use(auth.routes());

//misc
router.use(dbFields.routes());

/*
// entity's privileged routes
const authorised = require("./authRoutes");
router.use(authorised.routes());

// acounts routes
const accounts = require("./accounts");
router.use(accounts.routes());
*/
export default router;
