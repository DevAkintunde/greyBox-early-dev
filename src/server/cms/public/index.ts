import Router from "koa-router";
const router = new Router();

const publicRoutes = require("./public");
router.use(publicRoutes.routes());
