const Joi = require("joi");
const validatorHandler = require("../middlewares/validatorHandler");
const paragraphImageValidator = require("./paragraph/imageValidator");
const paragraphTextValidator = require("./paragraph/textValidator");

const submit = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).max(250).required(),
    featuredImagePath: Joi.string().trim().uri().min(3).max(250),
    summary: Joi.string().trim(),
    body: Joi.any(),
    alias: Joi.string().trim().max(100).required(),
    state: Joi.string().trim(),
    revisionNote: Joi.string().trim(),
    uuid: Joi.string()
      .guid({ version: ['uuidv4']}),
      //UUID is mere placeholder during creation but needed during entity update. 
  });
  if (ctx.request.body && ctx.request.body.body && ctx.request.body.body.length>0) {
     // set validation boolean as true for each paragraph type checked to ensure only validated paragraphs are processes by ORM to server.  
    ctx.request.body.body.forEach((paragraph, index) =>{
      if (paragraph.type === 'image') {
        paragraphImageValidator(ctx, paragraph);
        ctx.request.body.body[index].validated = true;
      } else if (paragraph.type === 'text') {
        paragraphTextValidator(ctx, paragraph);
        ctx.request.body.body[index].validated = true;
      }
    })
  }
  await validatorHandler(ctx, next, schema);
  //await next();
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
    alias: Joi.string().trim().max(100)
      .required(),
  });
  await validatorHandler(ctx, next, schema);
};

const state = async (ctx, next) => {
  const schema = Joi.object().keys({
    state: Joi.string().trim(),
  });
  await validatorHandler(ctx, next, schema);
};

module.exports = {
  submit,
  alias,
  state,
};
