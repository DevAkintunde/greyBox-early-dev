import Router from "@koa/router";

const router = new Router();

// pages entity routes
import { default as page } from "./page.js";
router.use(page.routes());

export default router;
