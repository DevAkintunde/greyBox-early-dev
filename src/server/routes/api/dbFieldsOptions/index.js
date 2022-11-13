import { default as publicAccessibleField } from "./public/index.js";
import { default as authRequiredField } from "./auth/index.js";

import Router from "@koa/router";
const router = new Router({
  prefix: "/field",
});

router.use(publicAccessibleField.routes());
router.use(authRequiredField.routes());

export default router;
