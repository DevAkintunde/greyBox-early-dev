"use strict";
//Scheduled for deletion entity routes
// minimum level 3 permission.
const {
  OK,
  UNAUTHORIZED,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../../../constants/statusCodes");
const sequelize = require("../../../config/db.config");
const Page = require("../../../models/contents/StaticPage.model");
const Blog = require("../../../models/contents/Blog.model");

const Router = require("@koa/router");
const router = new Router({
  prefix: "/bin",
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
    try {
    const Bin = await sequelize.transaction(async (t) => {
      await Page.findAll({
        where: {
          state: "deleted",
        }
      })
      await Blog.findAll({
        where: {
          state: "deleted",
          //markForDeletionBy
        }
      })
    }
    ctx.status = OK;
    return ctx.body = Bin
    }
    catch(err) {
      ctx.status = SERVER_ERROR;
      return ctx.body = err.parent ? err.parent.detail : err.message;
    }
  }
);

module.exports = router;
