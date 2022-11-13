"use strict";
// page operation routes
// minimum level 4 permission
import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
import {
  OK,
  UNAUTHORIZED,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} from "../../../constants/statusCodes.js";
import {
  submit as validateSubmit,
  alias as validateAlias,
  state as validateStateOptions,
} from "../../../validators/pageFormValidator.js";
import * as pageController from "../../../controllers/page.controller.js";
import sequelize from "../../../config/db.config.js";
import { mediaUpload } from "../../../middlewares/operations/mediaUpload.js";

import Router from "@koa/router";

const router = new Router({
  prefix: "/page",
});

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 4) {
    ctx.status = UNAUTHORIZED;
    ctx.message = "Admin user does not have the required permission.";
    return;
  }
  await next();
});

//view multiple available page entities
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
    //console.log('response',ctx.state.queryData)
    if (ctx.state.queryData) {
      ctx.status = OK;
      return (ctx.body = ctx.state.queryData);
    }
    return (ctx.status = BAD_REQUEST);
  }
);

router.post(
  "/create",
  validateSubmit,
  mediaUpload,
  pageController.createItem,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    ctx.status = CREATED;
    return (ctx.body = ctx.state.page);
  }
);

router.get(
  "/:alias",
  async (ctx, next) => {
    ctx.request.body = { alias: ctx.params.alias };

    await next();
    if (ctx.state.error) {
      ctx.status = BAD_REQUEST;
      return (ctx.body = {
        status: BAD_REQUEST,
        message: ctx.state.error.message,
      });
    }
    if (!ctx.state.page) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {});
    }
    ctx.status = OK;
    return (ctx.body = ctx.state.page);
  },
  pageController.viewItem
);

router.patch(
  "/:alias/update",
  async (ctx, next) => {
    ctx.request.body = {
      ...ctx.request.body,
      alias: ctx.params.alias,
    };
    await next();
  },
  validateSubmit,
  async (ctx, next) => {
    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    if (!ctx.state.page) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {});
    }
    ctx.status = OK;
    return (ctx.body = ctx.state.page);
  },
  pageController.updateItem
);

router.delete(
  "/:alias/delete",
  async (ctx, next) => {
    ctx.request.body = { alias: ctx.params.alias };
    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    ctx.status = OK;
    return ctx.body;
  },
  pageController.deleteItem
);

router.patch(
  "/:alias/update/alias",
  async (ctx, next) => {
    ctx.request.body = {
      ...ctx.request.body,
      currentAlias: ctx.params.alias,
    };
    await next();
  },
  validateAlias,
  async (ctx, next) => {
    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    ctx.status = OK;
    return ctx.body;
  },
  pageController.updateAlias
);

router.patch(
  "/:alias/update/state",
  async (ctx, next) => {
    ctx.request.body = {
      ...ctx.request.body,
      alias: ctx.params.alias,
    };
    await next();
  },
  validateStateOptions,
  async (ctx, next) => {
    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    ctx.status = OK;
    return ctx.body;
  },
  pageController.updateState
);

export default router;
