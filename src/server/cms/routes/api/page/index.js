import Router from "@koa/router";
import { default as page } from "./page.js";

const router = new Router({
  prefix: "/pages",
});

// pages entity routes
router.use(page.routes());

export default router;
