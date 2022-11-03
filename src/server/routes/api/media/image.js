"use strict";

import Router from "@koa/router";
const router = new Router({
  prefix: "/images",
});

router.use((ctx, next) => {
  console.log("you see images here");
  next();
});
router.get("/", async (ctx, next) => {
  console.log("image 99999999999");
  ctx.body = "okay, where my art";
});

export default router;
