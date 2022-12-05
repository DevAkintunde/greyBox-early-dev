import Router from "@koa/router";
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  SERVER_ERROR,
} from "../../../../constants/statusCodes.js";
import { aliasInjector } from "../../../../middlewares/operations/aliasInjector.js";
import { urlQueryTranslator } from "../../../../middlewares/urlQueryTranslator.js";
import * as mediaController from "../../../../controllers/media.controller.js";
import * as mediaFormValidator from "../../../../validators/mediaFormValidator.js";
import sequelize from "../../../../config/db.config.js";
import { logger } from "../../../../utils/logger.js";
import { UUID4Validator } from "../../../../functions/UUID4Validator.js";

const router = new Router({
  prefix: "/videos",
});

router.use((ctx, next) => {
  console.log("you see videos here");
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

router.post(
  "/upload",
  async (ctx, next) => {
    ctx.state.entityType = "Video";
    await next();
  },
  //mediaUpload,
  aliasInjector,
  mediaFormValidator.uploadVideo,
  async (ctx, next) => {
    if (
      ctx.request.body &&
      ctx.request.body.source &&
      ctx.request.body.source === "hosted"
    ) {
      await next();
    } else {
      try {
        let newVideo = sequelize.models[ctx.state.entityType].create(
          ctx.request.body
        );
        ctx.state.data = await newVideo;
      } catch (err) {
        logger.error(err);
        ctx.state.error = err;
      }
    }

    if (ctx.state.error) {
      ctx.status = SERVER_ERROR;
      ctx.message = ctx.state.error;
      return;
    }
    ctx.status = OK;
    ctx.body = {
      status: OK,
      data: ctx.state.data,
    };
    return;
  },
  mediaController.upload
);

//alias can be either path alias or entity UUID
router.get(
  "/:alias",
  async (ctx, next) => {
    ctx.state.entityType = "Video";
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  mediaController.viewItem,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = BAD_REQUEST;
      ctx.message = ctx.state.error.statusText;
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

router.patch(
  "/:alias/update",
  async (ctx, next) => {
    ctx.state.entityType = "Video";
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = {
        ...ctx.request.body,
        uuid: ctx.params.alias,
      };
    } else {
      ctx.request.body = {
        ...ctx.request.body,
        alias: ctx.params.alias,
      };
    }
    await next();
  },
  mediaFormValidator.uploadVideo,
  //mediaUpload,
  async (ctx, next) => {
    if (
      ctx.request.body &&
      ctx.request.body.source &&
      ctx.request.body.source === "hosted"
    ) {
      await next();
    } else {
      try {
        let newVideo = await sequelize.models[ctx.state.entityType].update(
          ctx.request.body,
          {
            where: { alias: ctx.request.body.alias },
          }
        );
        ctx.state.data = newVideo;
      } catch (err) {
        logger.error(err);
        ctx.state.error = err;
      }
    }

    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText;
      return;
    }
    ctx.status = OK;
    ctx.body = {
      status: OK,
      data: ctx.state.data,
    };
    return;
  },
  mediaController.updateItem
);

router.delete(
  "/:alias/delete",
  async (ctx, next) => {
    ctx.state.entityType = "Video";
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  mediaController.deleteItem,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      ctx.message = ctx.state.error.statusText;
      return;
    }
    ctx.status = OK;
    ctx.body = {
      status: OK,
      statusText: "Deleted",
    };
    return;
  }
);

router.patch(
  "/:alias/update/alias",
  mediaFormValidator.alias,
  async (ctx, next) => {
    ctx.state.entityType = "Video";
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = {
        ...ctx.request.body,
        uuid: ctx.params.alias,
      };
    } else {
      ctx.request.body = {
        ...ctx.request.body,
        currentAlias: ctx.params.alias,
      };
    }
    await next();
  },
  mediaController.updateAlias,
  async (ctx, next) => {
    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : "Media not found";
      return;
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
