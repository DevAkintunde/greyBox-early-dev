import Router from "@koa/router";
import { default as account } from "./account.js";

const router = new Router({
  prefix: "/account",
});

// admin routes
router.use(account.routes());

export default router;
