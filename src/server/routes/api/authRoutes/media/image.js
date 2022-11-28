import Router from "@koa/router";
import {
  BAD_REQUEST,
  OK,
  SERVER_ERROR,
} from "../../../../constants/statusCodes.js";
import { mediaUpload } from "../../../../middlewares/operations/mediaUpload.js";
import { urlQueryTranslator } from "../../../../middlewares/urlQueryTranslator.js";
import * as mediaController from "../../../../controllers/media.controller.js";
import * as mediaFormValidator from "../../../../validators/mediaFormValidator.js";
import { NOT_FOUND } from "../../../../constants/statusCodes.js";
import { aliasInjector } from "../../../../middlewares/operations/aliasInjector.js";
import { UUID4Validator } from "../../../../functions/UUID4Validator.js";

const router = new Router({
  prefix: "/images",
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
    ctx.state.entityType = "Image";
    console.log("review header", ctx.header);
    await next();
  },
  mediaUpload,
  async (ctx, next) => {
    console.log("check if styles exist", ctx.request.body);
    await next();
  },
  aliasInjector,
  mediaController.upload,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = SERVER_ERROR;
      ctx.message = ctx.state.error.statusText;
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

//alias can be either path alias or entity UUID
router.get(
  "/:alias",
  async (ctx, next) => {
    ctx.state.entityType = "Image";
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
    ctx.state.entityType = "Image";
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
  mediaFormValidator.uploadImage,
  mediaUpload,
  mediaController.updateItem,
  async (ctx, next) => {
    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
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

router.delete(
  "/:alias/delete",
  async (ctx, next) => {
    ctx.state.entityType = "Image";
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
    ctx.state.entityType = "Image";
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
