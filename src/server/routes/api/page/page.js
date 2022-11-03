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

router.use((ctx, next) => {
  console.log("page routing: ", ctx.header);
  next();
});
router.get("/about", async (ctx, next) => {
  console.log("body 77777777: ", "hgrdytfu");
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
