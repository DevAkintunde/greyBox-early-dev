"use strict";
// admin endpoints for entity creation. 

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  OK,
} = require("../../../constants/statusCodes");
const Status = require("../../../models/fields/EntityStatus.model");

const Router = require("@koa/router");
const router = new Router({
  prefix: "/create",
});
// route: /api/v1/admin/purview/create/page

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 3) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = {
      message: "Admin user does not have the required permission.",
    });
  }
  await next();
});

router.get("/page", async (ctx, next) => {
  console.log("whats going on....hhhh");
  try {
    const states = await Status.findAll();
    const text = { text: 'text'}
    const image = { image: 'path, title, alt' }
    const video = { video: 'source, title, url' }
    const pageBody = {
      fields: "title, summary, featuredImagePath, alias, state, body",
      stateOptions: { ...states },
      body: {
        paragraphs: [text, image, video],
      },
    }
    ctx.status = OK;
    return ctx.body = pageBody;
  } catch(err){
    ctx.status = BAD_REQUEST;
    return ctx.body ={
      status: BAD_REQUEST,
      message: err.message,
    }
  }
});

module.exports = router;
