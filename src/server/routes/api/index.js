import Router from "@koa/router";

const router = new Router({
  prefix: "/api/v2",
});

// pages, anonymous account routes & other public entities routes
import { default as account } from "./account/index.js";
router.use(account.routes());
import { default as page } from "./page/index.js";
router.use(page.routes());
// media entities routes
import { default as media } from "./media/index.js";
router.use(media.routes());

// privileged routes
import { default as auth } from "./authRoutes/index.js";
router.use(auth.routes());

/*
// entity's privileged routes
const authorised = require("./authRoutes");
router.use(authorised.routes());

// acounts routes
const accounts = require("./accounts");
router.use(accounts.routes());
*/
export default router;
