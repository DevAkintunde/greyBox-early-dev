const { UNAUTHORIZED } = require("../../../constants/statusCodes");

const Router = require("koa-router");
const router = new Router({
  prefix: "/auth",
});

// Signed In landing page
router.use(async (ctx, next) => {
  if (ctx.isUnauthenticated()) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = { message: "Unauthorised. Privileged users only" });
  }
  await next();
});

//list available auth paths
router.get("/", (ctx) => {
  let availableRoutes = {
    page: '/pages, /page/*',
    blog: '/blog, /blog/*',
    createEntity: '/createEndpoints'
  }
  ctx.status = OK;
  return (ctx.body = availableRoutes);
});

// pages
const pages = require("./admin.pages.route");
router.use(pages.routes());
// blog routes
const blog = require("./admin.blog.route");
router.use(blog.routes());
// user accounts routes
const accounts = require("./admin.accounts.route");
router.use(accounts.routes());
// Entity creation endpoints
const entityCreate = require("./createEndpoints");
router.use(entityCreate.routes());

module.exports = router;
