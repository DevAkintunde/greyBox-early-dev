import Joi from "joi";

const textValidator = (ctx, paragraph) => {
  const schema = Joi.object().keys({
    text: Joi.string().trim().required(),
    type: Joi.string(),
  });
  const { error } = schema.validate(paragraph);
  if (error) {
    ctx.status = 406;
    return (ctx.body = {
      status: "error",
      message: error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", ""),
    });
  }
  return;
};

export default textValidator;
