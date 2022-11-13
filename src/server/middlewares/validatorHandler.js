const validatorHandler = async (ctx, next, schema) => {
  const { error } = await schema.validate(ctx.request.body);
  if (error) {
    ctx.status = 406;
    ctx.message = error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", "");
    return;
  } else {
    return next();
  }
};

export default validatorHandler;
