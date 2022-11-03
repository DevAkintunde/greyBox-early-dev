"use strict";
// user accounts management routes
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
  signup: customerCreateFormValidator
} = require("../../../validators/customerAccountFormValidator");
const {
  signup: designerCreateFormValidator
} = require("../../../validators/designerAccountFormValidator");
const {
  signup: adminCreateFormValidator
} = require("../../../validators/adminAccountFormValidator");
const accountsController = require("../../../controllers/purview/accounts.controller");
const sequelize = require("../../../config/db.config");

const Router = require("@koa/router");
const router = new Router({
  prefix: "/accounts",
});
/*
Role definations:
    0. inactive role/null
    1. probation
    2. staff (staff and client officers)
    3. manager
    4. executive
    5. dev
*/

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 3) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = {
      message: "Admin user does not have the required permission.",
    });
  }
  await next();
});

// admin accounts
const admin = require("./account.type");
router.use(admin.routes());

module.exports = router;
