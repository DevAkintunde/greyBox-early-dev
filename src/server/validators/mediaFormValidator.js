import Joi from "joi";
import validatorHandler from "../middlewares/validatorHandler.js";

const uploadImage = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250).required(),
    alias: Joi.string().trim().max(100),
    uuid: Joi.string().guid({ version: ["uuidv4"] }),
  });
  await validatorHandler(ctx, next, schema);
};

const uploadVideo = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250).required(),
    alias: Joi.string().trim().max(100),
    source: Joi.string().trim().min(3).max(50),
    uuid: Joi.string().guid({ version: ["uuidv4"] }),
  });
  await validatorHandler(ctx, next, schema);
};

const alias = async (ctx, next) => {
  const schema = Joi.object().keys({
    alias: Joi.string().trim().max(100).required(),
    uuid: Joi.string().guid({ version: ["uuidv4"] }),
  });
  await validatorHandler(ctx, next, schema);
};

export { uploadImage, uploadVideo, alias };
