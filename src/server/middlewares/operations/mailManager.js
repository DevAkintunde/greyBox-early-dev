import multer from "@koa/multer";

const upload = multer({ dest: "public/images/" });

export const mailManager = async (ctx, next) => {
  console.log("ctx.request.body", ctx.request.body);

  await next();
};
