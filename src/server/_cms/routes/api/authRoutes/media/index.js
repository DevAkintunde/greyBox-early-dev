import Router from "@koa/router";
import sequelize from "../../../../config/db.config.js";
import {
  BAD_REQUEST,
  NO_CONTENT,
  OK,
  SERVER_ERROR,
} from "../../../../constants/statusCodes.js";
import { urlQueryTranslator } from "../../../../middlewares/urlQueryTranslator.js";
import { default as mediaRoutes } from "./media.routes.js";

const router = new Router({
  prefix: "/media",
});

router.use(async (ctx, next) => {
  if (
    !ctx.request.files &&
    (ctx.method.toLowerCase === "post" || ctx.method.toLowerCase === "patch")
  ) {
    ctx.status = NO_CONTENT;
    ctx.message = "No media available in request";
    return;
  }
  await next();
});

router.get(
  "/",
  async (ctx, next) => {
    //console.log("ctx.path", ctx.path);
    //console.log("ctx.originalUrl", ctx.originalUrl);
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[updated=ASC]&page[limit=10]";
    }
    await next();
  },
  urlQueryTranslator,
  (ctx) => {
    //console.log("response", ctx.state.data);
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

router.post("/swap-permission", async (ctx) => {
  const { uuid, type } = ctx.request.body;
  if (!uuid || !type) {
    ctx.status = BAD_REQUEST;
    ctx.message = "Both uuid & type of media must be present in request";
    return;
  }
  try {
    await sequelize.transaction(async (t) => {
      let fetchMedia = await sequelize.models[type].findOne(
        { where: { uuid: uuid } },
        { transaction: t }
      );
      console.log("fetchMedia", fetchMedia);
      if (fetchMedia) {
        let currentPerm = fetchMedia.path.includes("/global/")
          ? "/global/"
          : "/auth/";
        let newPerm = currentPerm === "/global/" ? "/auth/" : "/global/";
        let newPath = fetchMedia.path.split(currentPerm).join(newPerm);
        fetchMedia.set({ path: newPath }, { transaction: t });
        fetchMedia.changed("updated", true);
        fetchMedia.save();
      }
    });
    ctx.status = OK;
    return;
  } catch (err) {
    ctx.status = SERVER_ERROR;
    ctx.message = err;
    return;
  }
});

// media entity types
router.use(mediaRoutes.routes());

export default router;
