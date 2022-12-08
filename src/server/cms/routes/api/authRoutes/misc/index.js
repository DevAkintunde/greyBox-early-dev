import Router from "@koa/router";
import { default as paragraphs } from "./paragraphs.route.js";

const router = new Router();

// routes
router.use(paragraphs.routes());

export default router;
