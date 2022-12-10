import Joi from "joi";
import validatorHandler from "../middlewares/validatorHandler.js";
import paragraphImageValidator from "./paragraph/imageValidator.js";
import paragraphVideoValidator from "./paragraph/videoValidator.js";
import paragraphTextValidator from "./paragraph/textValidator.js";
import { logger } from "../utils/logger.js";

const submit = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250).required(),
    featuredImage: Joi.string().guid({ version: ["uuidv4"] }),
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
    let promises = [];
    // set validation boolean as true for each paragraph type checked to ensure only validated paragraphs are processes by ORM to server.
    Object.keys(ctx.request.body.body).forEach((paragraphId) => {
      if (ctx.request.body.body[paragraphId]["image"]) {
        ctx.request.body.body[paragraphId]["image"].weight =
          ctx.request.body.body[paragraphId]["image"].weight * 1;
        promises.push(
          paragraphImageValidator(
            ctx,
            ctx.request.body.body[paragraphId]["image"]
          )
        );
        ctx.request.body.body[paragraphId]["image"].validated = true;
      } else if (ctx.request.body.body[paragraphId]["video"]) {
        ctx.request.body.body[paragraphId]["video"].weight =
          ctx.request.body.body[paragraphId]["video"].weight * 1;
        promises.push(
          paragraphVideoValidator(
            ctx,
            ctx.request.body.body[paragraphId]["video"]
          )
        );
        ctx.request.body.body[paragraphId]["video"].validated = true;
      } else if (ctx.request.body.body[paragraphId]["text"]) {
        ctx.request.body.body[paragraphId]["text"].weight =
          ctx.request.body.body[paragraphId]["text"].weight * 1;
        promises.push(
          paragraphTextValidator(
            ctx,
            ctx.request.body.body[paragraphId]["text"]
          )
        );
        ctx.request.body.body[paragraphId]["text"].validated = true;
      }
    });
    try {
      Promise.all(promises);
    } catch (err) {
      logger.error("paragraph validation error: ", err);
      ctx.body = {
        status: err.status,
        statusText: err.statusText,
      };
      return;
    }
  }
  await validatorHandler(ctx, next, schema);
};

const alias = async (ctx, next) => {
  const schema = Joi.object().keys({
    alias: Joi.string().trim().max(100).required(),
    uuid: Joi.string().guid({ version: ["uuidv4"] }),
    autoAlias: Joi.boolean(),
    currentAlias: Joi.string().trim(),
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
