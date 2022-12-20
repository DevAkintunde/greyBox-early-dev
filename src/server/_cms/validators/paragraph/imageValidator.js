import Joi from "joi";

const imageValidator = (ctx, paragraph) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250),
    weight: Joi.number().required(),
    image: Joi.string().guid({ version: ["uuidv4"] }),
  });
  const { error } = schema.validate(paragraph);
  if (error) {
    ctx.throw(406, error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", ""));
  }
  return;
};

export default imageValidator;
