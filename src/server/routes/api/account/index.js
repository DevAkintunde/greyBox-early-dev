import Router from "@koa/router";

const router = new Router({
  prefix: "/account",
});

// admin routes
import { default as account } from "./account.js";
router.use(account.routes());

export default router;
