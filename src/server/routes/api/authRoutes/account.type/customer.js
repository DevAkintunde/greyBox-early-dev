const { UNAUTHORIZED } = require("../../../constants/statusCodes");

const Router = require("koa-router");
const router = new Router({
  prefix: "/customers",
});

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role >= 3) {
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
      ctx.originalUrl = ctx.originalUrl + "?sort[created=ASC]&page[limit=25]";
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
      creator: ctx.state.user.uuid,
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
  accountController.create
);

module.exports = router;
