import Router from "@koa/router";

const router = new Router();

// page, blog, products and other public entities routes
import { default as page } from "./page/index.js";
router.use(page.routes());
// media entities routes
import { default as media } from "./media/index.js";
router.use(media.routes());
/*
// entity's privileged routes
const authorised = require("./authRoutes");
router.use(authorised.routes());

// acounts routes
const accounts = require("./accounts");
router.use(accounts.routes());
*/
export default router;
