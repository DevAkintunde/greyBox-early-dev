// all APIs navigators
import Router from "@koa/router";
// routes imports
import { default as routes } from "./api/index.js";
import serve from "koa-static-server";

const router = new Router();
// Check if from registered app && enforced header Content-Type as 'application/json'
//include .use(serve({rootDir: 'public'}))
router
  .use(async (ctx, next) => {
    //alternatively, can redirect unidentifiable apps
    const remoteAppIDs = JSON.parse(process.env.remoteAppIDs);
    if (!remoteAppIDs.includes(ctx.header["x-requestapp"]))
      ctx.throw(406, "Unrecognisable App!");

    let allowableMethods = ["get", "post", "patch", "delete"];
    if (!allowableMethods.includes(ctx.method.toLocaleLowerCase()))
      ctx.throw(405, "Method not allowed!");

    if (
      ctx.method.toLowerCase() === "get" ||
      (ctx.method.toLowerCase() !== "get" &&
        (ctx.is("application/json") ||
          ctx.is("application/vnd.api+json") ||
          ctx.header["content-type"] === "application/json" ||
          ctx.header["content-type"] === "application/vnd.api+json" ||
          ctx.header["content-type"].includes("multipart/form-data")))
    ) {
      await next();
    } else {
      ctx.throw(406, "Unsupported content-type!");
    }
  })
  .use(routes.routes());

export default router;
