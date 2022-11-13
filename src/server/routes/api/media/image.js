import Router from "@koa/router";
import {
  BAD_REQUEST,
  OK,
  SERVER_ERROR,
} from "../../../constants/statusCodes.js";
import { mediaUpload } from "../../../middlewares/operations/mediaUpload.js";
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
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[created=ASC]&page[limit=10]";
    }
    await next();
  },
  urlQueryTranslator,
  (ctx) => {
    console.log("response", ctx.state.queryData);
    if (ctx.state.queryData) {
      ctx.status = OK;
      return (ctx.body = ctx.state.queryData);
    }
    ctx.status = BAD_REQUEST;
    return;
  }
);

router.post("/upload", mediaUpload, mediaController.upload, (ctx) => {
  if (ctx.state.error) {
    ctx.status = SERVER_ERROR;
    ctx.message = ctx.state.error;
    return;
  }
  ctx.body = ctx.state.media;
  ctx.status = OK;
  return;
});

export default router;
