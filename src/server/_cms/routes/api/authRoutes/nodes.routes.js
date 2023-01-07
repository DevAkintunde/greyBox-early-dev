// Node entities routes
// minimum level 4 permission
import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
import {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} from "../../../constants/statusCodes.js";
import * as formValidator from "../../../validators/nodeFormValidator.js";
import * as nodeController from "../../../controllers/node.controller.js";
import { aliasInjector } from "../../../middlewares/operations/aliasInjector.js";
import { UUID4Validator } from "../../../functions/UUID4Validator.js";
import { adminPageRoutes } from "../../../middlewares/privileges/pageNode.js";
import { adminBlogRoutes } from "../../../middlewares/privileges/blogNode.js";

import Router from "@koa/router";
import { ModelMapper } from "../../../constants/ModelMapper.js";

/* Nodes types definations
    page node entity: pages
    blog node entity: blog
 */
const router = new Router();

router.use(async (ctx, next) => {
  //control node privilege access for specific node types
  if (ctx.path.includes("/auth/pages")) {
    await adminPageRoutes(ctx, next);
  } else if (ctx.path.includes("/auth/blog")) {
    await adminBlogRoutes(ctx, next);
  } else {
    if (ctx.path.includes("/auth/all-nodes")) await next();

    ctx.status = BAD_REQUEST;
    ctx.message = "Route undefined on server.";
  }
});

//view all available types of nodes
router.get(
  "/all-nodes",
  async (ctx, next) => {
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[created=ASC]&page[limit=10]";
    }
    //Eject nodes params from ctx.params
    ctx.params = {};
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

//view multiple available per node type
router.get(
  "/:type",
  async (ctx, next) => {
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl = ctx.originalUrl + "?sort[created=ASC]&page[limit=10]";
    }
    //Eject nodes params from ctx.params
    ctx.params = {};
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
  "/:type/:alias",
  async (ctx, next) => {
    ctx.state.nodeType = ModelMapper[ctx.params.type]
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  nodeController.viewItem,
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
  "/:type/:alias/update",
  formValidator.submit,
  async (ctx, next) => {
    ctx.state.nodeType = ModelMapper[ctx.params.type]
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
  nodeController.updateItem,
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
    ctx.state.nodeType = ModelMapper[ctx.params.type]
    if (UUID4Validator(ctx.params.alias)) {
      ctx.request.body = { uuid: ctx.params.alias };
    } else {
      ctx.request.body = { alias: ctx.params.alias };
    }
    await next();
  },
  nodeController.deleteItem,
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
    ctx.state.nodeType = ModelMapper[ctx.params.type]
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
  nodeController.updateAlias,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : `${ctx.state.nodeType} not found`;
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
  formValidator.status,
  async (ctx, next) => {
    ctx.state.nodeType = ModelMapper[ctx.params.type]
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
  nodeController.updateStatus,
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status
        ? ctx.state.error.status
        : SERVER_ERROR;
      ctx.message = ctx.state.error.statusText
        ? ctx.state.error.statusText
        : `${ctx.state.nodeType} not found`;
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
    ctx.state.nodeType = ModelMapper[ctx.params.type]
    await next();
  },
  aliasInjector,
  formValidator.submit,
  nodeController.createItem,
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
