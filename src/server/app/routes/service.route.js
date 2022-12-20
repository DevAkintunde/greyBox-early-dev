// pages routes

import { urlQueryTranslator } from "../../_cms/middlewares/urlQueryTranslator.js";
import Service from "../models/Service.model.js";
import Router from "@koa/router";
import { OK, NOT_FOUND } from "../../_cms/constants/statusCodes.js";

const router = new Router({
    prefix: '/service'
});

router.use(async (ctx, next) => {
  console.log("we are here 4444");
});

router.get("/", async (ctx, next) => {
  ctx.set({ "content-type": "application/json" });
  return (ctx.body = { key: "holla at your boy baby" });
}); 

router.get("/:alias", async (ctx, next) => {
  let alias = ctx.params.alias;
  const page = await Service.findOne({
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
