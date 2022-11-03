const validatorHandler = async (ctx, next, schema) => {
  const { error } = await schema.validate(ctx.request.body);
  if (error) {
    ctx.status = 406;
    return (ctx.body = {
      status: "error",
      message: error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", ""),
    });
  } else {
    return next();
  }
};

module.exports = validatorHandler;
