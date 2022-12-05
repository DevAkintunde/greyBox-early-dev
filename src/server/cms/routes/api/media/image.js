import Router from "@koa/router";
import { BAD_REQUEST, NOT_FOUND, OK } from "../../../constants/statusCodes.js";
import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
import * as mediaController from "../../../controllers/media.controller.js";

const router = new Router({
  prefix: "/images",
});

router.use((ctx, next) => {
  console.log("you see images here");
  next();
});

router.get(
  "/",
  async (ctx, next) => {
    console.log("ctx.path", ctx.path);
    console.log("ctx.originalUrl", ctx.originalUrl);
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[updated=ASC]&page[limit=10]";
    }
    await next();
  },
  urlQueryTranslator,
  (ctx) => {
    console.log("response", ctx.state.data);
    if (ctx.state.data) {
      ctx.status = OK;
      ctx.body = {
        status: OK,
        data: ctx.state.data,
      };
      return;
    }
    ctx.status = BAD_REQUEST;
    return;
  }
);

router.get(
  "/:alias",
  async (ctx, next) => {
    ctx.state.entityType = "Image";
    ctx.request.body = { alias: ctx.params.alias };
    await next();
  },
  mediaController.viewItem,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = BAD_REQUEST;
      ctx.message = ctx.state.error.message;
      return;
    }
    if (!ctx.state.data) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {});
    }
    ctx.status = OK;
    ctx.body = {
      status: OK,
      data: ctx.state.data,
    };
    return;
  }
);

export default router;
