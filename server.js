import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

import Koa from "koa";
import c2k from "koa-connect";
import serve from "koa-static-server";
import session from "koa-session";
import logger from "koa-logger";
import cron from "node-cron";
import cors from "@koa/cors";
import passport from "koa-passport";
import { logger as appLogger } from "./src/server/utils/logger.js";
//const { jobScheduler } = require("./cron/job");
//const { httpLogStream } = require("./utils/logger");

// scheduler
//cron.schedule("0 1 * * *", jobScheduler);

//file imports
import router from "./src/server/routes/api.route.js";
// authentication
import { passportConfig } from "./src/server/middlewares/authorization/auth.js";
passportConfig(passport);

// The App
const app = new Koa();
// sessions
app.keys = [process.env.COOKIE_KEY];
const sessionConfig = {
  key: process.env.COOKIE_IDENTIFIER,
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
  secure: process.env.NODE_ENV === "development" ? false : true, //change to true in production
  sameSite: null,
};

// corsOptions
var corsOptions = {
  origin: "https://studio.mellywood.com",
  //allowedMethods: '',
  //exposeHeaders: '',
  //allowHeaaders: ''
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createThisServer(env = process.env.NODE_ENV) {
  const resolve = (p) => path.resolve(__dirname, p);
  const indexHTML =
    env === "production" ? "dist/client/index.html" : "index.html";
  let vite =
    env !== "production"
      ? await createViteServer({
          server: {
            //root: resolve("./"),
            middlewareMode: true,
            watch: {
              // During tests we edit the files too fast and sometimes chokidar
              // misses change events, so enforce polling for consistency
              usePolling: true,
              interval: 100,
            },
            /* hmr: {
              port: hmrPort,
            }, */
          },
          appType: "custom",
        })
      : null;

  app
    .use(logger())
    .use(session(sessionConfig, app))
    .use(cors(corsOptions))
    .use(passport.initialize())
    .use(passport.session())
    .use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        appLogger.error(err);
        if (env !== "production") console.log(err);
        ctx.status = err.statusCode || err.status || err.statusText || 500;
        if (err.message) ctx.message = err.message;
        ctx.body = {
          status: ctx.status,
          statusText: err.message ? err.message : undefined,
        };
      }
    });

  if (env !== "production") {
    //add Vite middleware watcher.
    //vite.middlewares supports only express server.
    //Koa-connect allows to use ExpressJS middlewares in KoaJS
    app.use(c2k(vite.middlewares));
  }
  app.use(router.routes()).use(router.allowedMethods());
  app.use(async (ctx, next) => {
    await next();
    const url = ctx.originalUrl;

    try {
      console.log("url: ", url);
      console.log("header: ", ctx.headers["x-requesttoken"]);
      //ctx.session.loginID = "olowo yin";
      console.log("session: ", ctx.session);
      console.log(
        "session id:",
        ctx.cookies.get(process.env.COOKIE_IDENTIFIER)
      );
      //read index.html
      let template = fs.readFileSync(resolve(indexHTML), "utf-8");
      let appHtml;
      //console.log("hmrPort: ", hmrPort);
      if (env !== "production") {
        //Apply Vite HTML transforms but always read fresh template in dev
        template = await vite.transformIndexHtml(url, template);
        // Load the server entry
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        appHtml = await render(url);
      } else {
        app.use(serve({ rootDir: "dist/client", index: false }));
        // Load the server entry
        const { render } = await import("./dist/server/entry-server.js");
        appHtml = await render(url);
      }
      // Inject app-rendered HTML into template
      const html = template.replace(`<!--app-html-->`, await appHtml);
      // Send rendered HTML back
      ctx.status = 200;
      ctx.type = "text/html; charset=utf-8";
      ctx.body = html;
    } catch (e) {
      env !== "production" && vite.ssrFixStacktrace(e);
      //console.log(e.stack);
      ctx.status = 500;
      ctx.body = e.stack;
    }
  });
  /* app.on("error", (err, ctx) => {
    appLogger.error(err);
  }); */
  app.listen(5173);
  //return { app, vite };
}
createThisServer();
/* createThisServer().then(({ app }) =>
  app.listen(5173, () => {
    console.log("server running now!");
  })
); */
