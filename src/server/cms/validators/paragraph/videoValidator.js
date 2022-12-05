import Joi from "joi";

const videoValidator = (ctx, paragraph) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250),
    alt: Joi.string().trim().min(3).max(250).required(),
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

export default videoValidator;
