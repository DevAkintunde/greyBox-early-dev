import Joi from "joi";
import validatorHandler from "../middlewares/validatorHandler.js";

const uploadImage = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250).required(),
    alias: Joi.string().trim().max(100).required(),
  });
  await validatorHandler(ctx, next, schema);
};

const alias = async (ctx, next) => {
  const schema = Joi.object().keys({
    alias: Joi.string().trim().max(100).required(),
  });
  await validatorHandler(ctx, next, schema);
};

const mediaSource = async (ctx, next) => {
  const schema = Joi.object().keys({
    source: Joi.string().trim(),
  });
  await validatorHandler(ctx, next, schema);
};

export { uploadImage, alias, mediaSource };
