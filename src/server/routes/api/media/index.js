import Router from "@koa/router";

const router = new Router();

// media entity types
import { default as image } from "./image.js";
router.use(image.routes());
import { default as video } from "./video.js";
router.use(video.routes());

export default router;
