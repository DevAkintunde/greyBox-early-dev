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
import { UUID4Validator } from "../../../functions/UUID4Validator.js";

const router = new Router({
  prefix: "/pages",
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
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  pageController.viewItem,
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
      ...ctx.state.data,
    };
    return;
  }
);

router.patch(
  "/:alias/update",
  async (ctx, next) => {
    console.log("path: ", ctx.path);
    console.log("url: ", ctx.url);
    console.log("origin: ", ctx.origin);
    console.log("href: ", ctx.href);
    console.log("host: ", ctx.host);
    console.log("body: ", ctx.request.body);
    console.log("body P: ", JSON.stringify(ctx.request.body.body, null, 2));
    ctx.state.entityType = "Page";
    //ctx.state.entityUpdate = true;
    if (ctx.request.body && ctx.request.body.alias) {
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
    } else {
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
    }
    await next();
  },
  aliasInjector,
  formValidator.submit,
  pageController.updateItem,
  async (ctx) => {
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
      ...ctx.state.data,
    };
    return;
  }
);

router.delete(
  "/:alias/delete",
  async (ctx, next) => {
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  pageController.deleteItem,
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
  async (ctx, next) => {
    ctx.state.entityType = "Page";
    let { alias } = ctx.request.body;
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = {
        alias: alias.split(" ").join("-").toLowerCase(),
        uuid: ctx.params.alias,
      };
    } else {
      ctx.request.body = {
        alias: alias.split(" ").join("-").toLowerCase(),
        currentAlias: ctx.params.alias,
      };
    }
    await next();
  },
  aliasInjector,
  formValidator.alias,
  pageController.updateAlias,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : "Page not found";
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

router.patch(
  "/:alias/update/status",
  formValidator.status,
  async (ctx, next) => {
    ctx.state.entityType = "Page";
    let { status } = ctx.request.body;
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = {
        status: status,
        uuid: ctx.params.alias,
      };
    } else {
      ctx.request.body = {
        status: status,
        alias: ctx.params.alias,
      };
    }
    await next();
  },
  aliasInjector,
  pageController.updateStatus,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : "Page not found";
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

router.post(
  "/create",
  async (ctx, next) => {
    ctx.state.entityType = "Page";
    await next();
  },
  aliasInjector,
  formValidator.submit,
  pageController.createItem,
  (ctx) => {
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
      ...ctx.state.data,
    };
    return;
  }
);

export default router;
