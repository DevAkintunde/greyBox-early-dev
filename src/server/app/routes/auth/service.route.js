// services routes
import { urlQueryTranslator } from "../../../_cms/middlewares/urlQueryTranslator.js";
import Service from "../../models/Service.model.js";
import Router from "@koa/router";
import {
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  SERVER_ERROR,
  CREATED,
} from "../../../_cms/constants/statusCodes.js";
import { UUID4Validator } from "../../../_cms/functions/UUID4Validator.js";
import * as serviceFormValidator from "../../validators/serviceFormValidator.js";
import { aliasInjector } from "../../../_cms/middlewares/operations/aliasInjector.js";
import * as serviceController from '../../controllers/services.controller.js'

const router = new Router({
  prefix: "/services",
});

router.use(async (ctx, next) => {
  await next();
});

//view all available types of nodes
router.get(
  "/",
  async (ctx, next) => {
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[created=ASC]&page[limit=10]";
    }
    await next();
  },
  //urlQueryTranslator,
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
  serviceController.viewItem,
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
  serviceFormValidator.submit,
  async (ctx, next) => {
    //ctx.state.nodeUpdate = true;
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
  serviceController.updateItem,
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
  "/:type/:alias/delete",
  async (ctx, next) => {
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  serviceController.deleteItem,
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
  "/:type/:alias/update/alias",
  async (ctx, next) => {
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
  serviceFormValidator.alias,
  serviceController.updateAlias,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : `Service not found`;
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
  "/:type/:alias/update/status",
  serviceFormValidator.status,
  async (ctx, next) => {
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
  serviceController.updateStatus,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : `Service not found`;
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
  "/:type/create",
  async (ctx, next) => {
    await next();
  },
  aliasInjector,
  serviceFormValidator.submit,
  serviceController.createItem,
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
      status: CREATED,
      ...ctx.state.data,
    };
    return;
  }
);

export default router;
