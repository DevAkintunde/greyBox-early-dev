const Joi = require("joi");
const validatorHandler = require("../middlewares/validatorHandler");

const submit = async (ctx, next) => {
  const schema = Joi.object().keys({
    destination: Joi.string().trim().uri().min(3).max(250).required(),
    backHalf: Joi.string().trim().pattern(new RegExp("^[a-zA-Z0-9_\-.&]{3,50}$")).min(3).max(50),
  });
  await validatorHandler(ctx, next, schema);
};

const premiumOption = async (ctx, next) => {
  const schema = Joi.object().keys({
    premiumStatus: Joi.string().trim().required(),
  });
  await validatorHandler(ctx, next, schema);
};

const statusUpdate = async (ctx, next) => {
  const schema = Joi.object().keys({
    status: Joi.string().boolean(),
  });
  await validatorHandler(ctx, next, schema);
};

const payAsYouGoOption = async (ctx, next) => {
  const schema = Joi.object().keys({
    pay_as_you_go: Joi.string().trim().required(),
  });
  await validatorHandler(ctx, next, schema);
};

module.exports = {
  submit,
  premiumOption,
  statusUpdate,
  payAsYouGoOption
};
