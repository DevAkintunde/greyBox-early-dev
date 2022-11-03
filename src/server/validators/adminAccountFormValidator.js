const Joi = require("joi");
const validatorHandler = require("../middlewares/validatorHandler");

const create = async (ctx, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().trim().min(3).max(50).required(),
    lastName: Joi.string().trim().min(3).max(50),
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required(),
  });
  await validatorHandler(ctx, next, schema);
};

const signin = async (ctx, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required(),
  });
  await validatorHandler(ctx, next, schema);
};

const update = async (ctx, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().trim().min(3).max(50).required(),
    lastName: Joi.string().trim().min(3).max(50),
  });
  await validatorHandler(ctx, next, schema);
};

const changePassword = async (ctx, next) => {
  const schema = Joi.object().keys({
    currentPassword: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required(),
    newPassword: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required(),
  });
  await validatorHandler(ctx, next, schema);
};

// reset forgotten password
const resetPassword = async (ctx, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
  });
  await validatorHandler(ctx, next, schema);
};

module.exports = {
  create,
  signin,
  update,
  changePassword,
  resetPassword
};
