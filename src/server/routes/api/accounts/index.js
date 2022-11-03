const Router = require("koa-router");
const router = new Router();

// customer account routes
const customer = require("./customer.route");
router.use(customer.routes());
// designer account routes
//const designer = require("./designer.route");
//router.use(designer.routes());
// admin routes
const admin = require("./admin.route");
router.use(admin.routes());

module.exports = router;
