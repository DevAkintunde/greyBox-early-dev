const urlQueryTranslator = require("../../../../middlewares/urlQueryTranslator");
const {
  OK,
  UNAUTHORIZED,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../../../../constants/statusCodes");
const {
  create: adminCreateFormValidator
} = require("../../../../validators/adminAccountFormValidator");
const accountController = require("../../../../controllers/purview/manage.account.controller");
const sequelize = require("../../../../config/db.config");

const Router = require("koa-router");
const router = new Router({
  prefix: "/admin",
});

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 4) {
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
  adminCreateFormValidator,
  checkAccount(false),
  async (ctx, next) => {
    ctx.request.body = {
      ...ctx.request.body,
      creator: ctx.state.user.uuid,
    };
    ctx.state.type = 'Admin';

    await next();
    if (ctx.state.error) {
      ctx.status = ctx.state.error.status;
      return (ctx.body = {
        status: ctx.state.error.status,
        message: ctx.state.error.message,
      });
    }
    ctx.status = CREATED;
    return (ctx.body = ctx.state.newUser);
  },
  accountController.create
);

module.exports = router;
