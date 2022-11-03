"use strict";
// blog routes
// minimum level 3 permission.
const urlQueryTranslator = require("../../../middlewares/urlQueryTranslator");
const {
  OK,
  UNAUTHORIZED,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../../../constants/statusCodes");
const {
  submit: validateSubmit,
  alias: validateAlias,
  state: validateStateOptions,
} = require("../../../validators/blogFormValidator");
const blogController = require("../../../controllers/purview/blog.controller");
const sequelize = require("../../../config/db.config");

const Router = require("@koa/router");
const router = new Router({
  prefix: "/blog",
});

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 3) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = {
      message: "Admin user does not have the required permission.",
    });
  }
  await next();
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
  async (ctx, next) => {
    ctx.request.body = {
      ...ctx.request.body,
      author: ctx.state.user.uuid,
    };

    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    ctx.status = CREATED;
    return (ctx.body = ctx.state.blog);
  },
  blogController.create
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
    if (!ctx.state.blog) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {});
    }
    ctx.status = OK;
    return (ctx.body = ctx.state.blog);
  },
  blogController.view
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
    if (!ctx.state.blog) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {});
    }
    ctx.status = OK;
    return (ctx.body = ctx.state.blog);
  },
  blogController.update
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
    return ctx.body
  },
  blogController.delete
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
    return ctx.body
  },
  blogController.updateAlias
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
    return ctx.body
  },
  blogController.updateState
);

module.exports = router;
