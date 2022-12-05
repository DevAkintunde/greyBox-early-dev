import Joi from "joi";
import validatorHandler from "../middlewares/validatorHandler.js";
import paragraphImageValidator from "./paragraph/imageValidator.js";
import paragraphVideoValidator from "./paragraph/videoValidator.js";
import paragraphTextValidator from "./paragraph/textValidator.js";

const submit = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250).required(),
    featuredImage: Joi.string().trim().uri().min(3).max(250),
    summary: Joi.string().trim(),
    body: Joi.any(),
    alias: Joi.string().trim().max(100),
    status: Joi.string().trim(),
    revisionNote: Joi.string().trim(),
    autoAlias: Joi.boolean(),
    uuid: Joi.string().guid({ version: ["uuidv4"] }),
    //UUID is mere placeholder during creation but needed during entity update.
  });
  if (
    ctx.request.body &&
    ctx.request.body.body &&
    Object.keys(ctx.request.body.body).length > 0
  ) {
    // set validation boolean as true for each paragraph type checked to ensure only validated paragraphs are processes by ORM to server.
    Object.keys(ctx.request.body.body).forEach((paragraph) => {
      if (ctx.request.body.body["paragraph"]["type"] === "image") {
        paragraphImageValidator(ctx, paragraph);
        ctx.request.body.body["paragraph"].validated = true;
      } else if (ctx.request.body.body["paragraph"]["type"] === "video") {
        paragraphVideoValidator(ctx, paragraph);
        ctx.request.body.body["paragraph"].validated = true;
      } else if (ctx.request.body.body["paragraph"]["type"] === "text") {
        paragraphTextValidator(ctx, paragraph);
        ctx.request.body.body["paragraph"].validated = true;
      }
    });
  }
  await validatorHandler(ctx, next, schema);
};
/*
const uuid = async (ctx, next) => {
  const schema = Joi.object().keys({
    uuid: Joi.string()
      .guid({ version: ['uuidv4']})
      .required(),
  });
  await validatorHandler(ctx, next, schema);
};
*/
const alias = async (ctx, next) => {
  const schema = Joi.object().keys({
    alias: Joi.string().trim().max(100).required(),
    autoAlias: Joi.boolean(),
  });
  await validatorHandler(ctx, next, schema);
};

const status = async (ctx, next) => {
  const schema = Joi.object().keys({
    status: Joi.string().trim(),
  });
  await validatorHandler(ctx, next, schema);
};

export { submit, alias, status };
