// pages routes

import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
import Page from "../../../models/entities/nodes/StaticPage.model.js";
import Router from "@koa/router";
import { NOT_FOUND, OK } from "../../../constants/statusCodes.js";

const router = new Router();

router.get("/about", async (ctx, next) => {
  ctx.set({ "content-type": "application/json" });
  return (ctx.body = { key: "holla at your boy baby" });
});

router.get("/:alias", async (ctx, next) => {
  let alias = ctx.params.alias;
  const page = await Page.findOne({
    where: {
      alias: alias,
      state: "published",
    },
  });
  if (!page) {
    ctx.status = NOT_FOUND;
    return (ctx.body = {});
  }
  ctx.status = OK;
  return (ctx.body = alias);
});

export default router;
