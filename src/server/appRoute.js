//import and define custom database Models defined in App
//define routes
import Router from "@koa/router";
import { default as appRoutesIndex } from "./app/routes/index.js";

/* Models */
export const ModelMapper = {
    service: 'Service'
}

const router = new Router({
  prefix: "/app",
});
router.use(appRoutesIndex.routes())

export default router;
