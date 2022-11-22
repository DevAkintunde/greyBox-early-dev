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
import * as formValidator from "../../../validators/pageFormValidator.js";
import * as pageController from "../../../controllers/page.controller.js";
import sequelize from "../../../config/db.config.js";
import { mediaUpload } from "../../../middlewares/operations/mediaUpload.js";

import Router from "@koa/router";
import { aliasInjector } from "../../../middlewares/operations/aliasInjector.js";

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
  async (ctx, next) => {
    console.log("page string", JSON.stringify(ctx.request.body));
    console.log("page data", JSON.stringify(ctx.request.body, null, 2));
    await next();
  },
  formValidator.submit,
  aliasInjector,
  mediaUpload,
  async (ctx, next) => {
    console.log("page media check string", JSON.stringify(ctx.request.body));
    console.log(
      "page media check data",
      JSON.stringify(ctx.request.body, null, 2)
    );
    await next();
  },
  pageController.createItem,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      ctx.message = ctx.state.error.statusText;
      return;
    }
    ctx.body = {
      status: OK,
      data: ctx.state.data,
    };
    return;
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
  formValidator.submit,
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
  formValidator.alias,
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
  "/:alias/update/status",
  async (ctx, next) => {
    ctx.request.body = {
      ...ctx.request.body,
      alias: ctx.params.alias,
    };
    await next();
  },
  formValidator.status,
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
  pageController.updateStatus
);

export default router;
