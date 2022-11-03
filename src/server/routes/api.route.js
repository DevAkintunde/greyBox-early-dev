// all APIs navigators
import { koaBody } from "koa-body";
import Router from "@koa/router";
// routes imports
import { default as routes } from "./api/index.js";

const router = new Router();

// Check if from registered app && enforced header Content-Type as 'application/json'
router
  .use(async (ctx, next) => {
    const remoteAppIDs = JSON.parse(process.env.remoteAppIDs);
    //Enable before deploy
    /* if (!remoteAppIDs.includes(ctx.header["x-requestapp"])) {
      ctx.throw(406, "Unrecognisable App!");
    } */

    //console.log("is function: ", ctx.is("application/json"));
    if (
      ctx.method.toLowerCase() !== "get" &&
      (!ctx.is("application/json") || ctx.is("application/json") === false)
    ) {
      ctx.throw(406, "Unsupported content-type");
    }
    await next();
  })
  .use(koaBody())
  .use(routes.routes());

export default router;
