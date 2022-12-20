import Joi from "joi";

const textValidator = (ctx, paragraph) => {
  console.log("validator", paragraph);
  const schema = Joi.object().keys({
    value: Joi.string().trim().required(),
    weight: Joi.number().required(),
  });
  const { error } = schema.validate(paragraph);
  if (error) {
    ctx.throw(406, error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", ""));
  }
  return;
};

export default textValidator;
