import Router from "@koa/router";
import { default as service } from "./auth/service.route.js";

const router = new Router();

router.use(async (ctx, next) => {
  console.log("we are here 33333333333");
  next();
});

router.use(service.routes());

export default router;
