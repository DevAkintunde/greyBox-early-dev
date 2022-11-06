"use strict";
// pages routes

/* const urlQueryTranslator = require("../../../../middlewares/urlQueryTranslator");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../../../../constants/statusCodes");
const Page = require("../../../../models/entities/nodes/StaticPage.model"); */

import Router from "@koa/router";
const router = new Router();

router.use(async (ctx, next) => {
  console.log("page routing: ", ctx.header);
  console.log("page type: ", ctx.type);
  //ctx.type = "application/json; charset=utf-8";
  next();
});
router.get("/about", async (ctx, next) => {
  ctx.set({ "content-type": "application/json" });
  return (ctx.body = { key: "holla at your boy baby" });
});

router.get("/:alias", async (ctx, next) => {
  let alias = ctx.params.alias;
  /*   const page = await Page.findOne({
    where: {
      alias: alias,
      state: "published",
    },
  });
  if (!page) {
    ctx.status = NOT_FOUND;
    return (ctx.body = {});
  } */
  ctx.status = OK;
  return (ctx.body = alias);
});

export default router;
