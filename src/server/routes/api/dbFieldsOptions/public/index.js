//import { default as publicAccessibleFields } from "./public/index.js";

import Router from "@koa/router";
const router = new Router({
  prefix: "/public",
});

//router.use(publicAccessibleFields.routes());

export default router;
