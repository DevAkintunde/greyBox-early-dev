//import and define custom database Models defined in App
//define routes
import Router from "@koa/router";
import { default as appRoutesIndex } from "./app/routes/index.js";

/* App Models */
export const ModelMapper = {
  service: "Service",
};

/* App defined internal routes */
export const routes = new Router({
  prefix: "/app",
});
routes.use(appRoutesIndex.routes());
