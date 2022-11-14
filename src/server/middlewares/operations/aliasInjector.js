import sequelize from "../../config/db.config.js";

const aliasInjector = async (ctx, next) => {
  if (ctx.request.body) {
    let generatedAlias = ctx.request.body.title
      ? ctx.request.body.title.split(" ").join("-").toLowerCase()
      : Math.random().toString(36).substring(5);

    if (ctx.request.body.title && ctx.state.entityType) {
      let thisEntity = await sequelize.models[ctx.state.entityType].findOne({
        where: { alias: generatedAlias },
      });
      if (thisEntity)
        generatedAlias =
          generatedAlias + Math.random().toString(36).substring(5);
    }

    ctx.request.body = {
      ...ctx.request.body,
      alias: generatedAlias,
    };
  }
  await next();
};
export { aliasInjector };
