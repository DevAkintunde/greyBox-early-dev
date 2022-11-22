// all APIs navigators
import { koaBody } from "koa-body";
import Router from "@koa/router";
// routes imports
import { default as routes } from "./api/index.js";
import path from "node:path";
import serve from "koa-static-server";
import { NOT_ACCEPTABLE } from "../constants/statusCodes.js";

const router = new Router();
const __dirname = path.dirname("./");
// Check if from registered app && enforced header Content-Type as 'application/json'
//include .use(serve({rootDir: 'public'}))
router
  .use(
    koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 2 * 1024 * 1024,
        filter: (part) => {
          return (
            (part.mimetype &&
              (part.mimetype.includes("image/jpg") ||
                part.mimetype.includes("image/jpeg"))) ||
            part.mimetype.includes("image/png") ||
            part.mimetype.includes("image/webp")
          );
        },
        uploadDir: path.join(__dirname, process.env.privatePath),
        keepExtensions: true,
        filename: (name, ext, form) => {
          return (
            process.env.appName +
            "-" +
            form.name +
            "-" +
            Date.now().toString() +
            ext
          );
        },
      },
      onError: (err, ctx) => {
        //formidable Error: image more than required size, CODE = 1009
        if (err.code === 1009)
          ctx.throw(NOT_ACCEPTABLE, "Media exceeds maximum allowed size");
        ctx.throw(err);
      },
    })
  )
  .use(async (ctx, next) => {
    //alternatively, can redirect unidentifiable apps
    const remoteAppIDs = JSON.parse(process.env.remoteAppIDs);
    //Enable before deploy
    /* if (!remoteAppIDs.includes(ctx.header["x-requestapp"])) {
      ctx.throw(406, "Unrecognisable App!");
    } */

    let allowableMethods = ["get", "post", "patch", "delete"];
    /* if (
      ctx.method.toLowerCase() !== "get" &&
      (!ctx.is("application/json") ||
        ctx.header["content-type"] !== "application/json")
    ) {
      ctx.throw(406, "Unsupported content-type!");
    } */
    if (!allowableMethods.includes(ctx.method.toLocaleLowerCase()))
      ctx.throw(405, "Method not allowed!");
    if (
      (ctx.method.toLowerCase() === "post" ||
        ctx.method.toLowerCase() === "patch") &&
      !ctx.request.body
    )
      ctx.throw(400, "Bad request!");

    //console.log("body", JSON.stringify(ctx.request.body, null, 2));
    console.log("files", ctx.request.files);

    await next();
  })
  .use(routes.routes());

export default router;
