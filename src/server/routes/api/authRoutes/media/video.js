"use strict";

import Router from "@koa/router";
const router = new Router({
  prefix: "/videos",
});

router.use((ctx, next) => {
  console.log("you see videos here");
  next();
});
router.get("/", async (ctx, next) => {
  console.log("videos 44444444");
});

export default router;
