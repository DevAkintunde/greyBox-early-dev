import sequelize from "../../config/db.config.js";
import { BAD_REQUEST, NOT_ACCEPTABLE } from "../../constants/statusCodes.js";

const aliasInjector = async (ctx, next) => {
  if (ctx.request.body && Object.keys(ctx.request.body).length > 0) {
    if (ctx.state.entityType) {
      let thisAlias =
        ctx.request.body.autoAlias && ctx.request.body.autoAlias === "true"
          ? ctx.request.body.title
            ? ctx.request.body.title.split(" ").join("-").toLowerCase()
            : Math.random().toString(36).substring(5)
          : ctx.request.body.alias
          ? ctx.request.body.alias
          : Math.random().toString(36).substring(5);

      let checkEntityId;
      if (ctx.request.body.uuid) {
        checkEntityId = ctx.request.body.uuid;
      } else if (ctx.request.body.currentAlias) {
        try {
          await sequelize.models[ctx.state.entityType]
            .findOne({
              where: {
                alias: ctx.request.body.currentAlias,
              },
            })
            .then((res) => {
              //console.log("checking entity uuid", res);
              if (res.toJSON().uuid) checkEntityId = res.toJSON().uuid;
            });
        } catch (err) {
          ctx.throw(BAD_REQUEST, "Entity type not identifiable");
        }
      }

      if (checkEntityId) {
        try {
          let thisEntity = await sequelize.models[ctx.state.entityType].findOne(
            {
              where: { alias: thisAlias },
            }
          );
          if (
            thisEntity &&
            thisEntity.toJSON().uuid &&
            thisEntity.toJSON().uuid !== checkEntityId
          ) {
            thisAlias = thisAlias + Math.random().toString(36).substring(5);
          }
        } catch (err) {
          ctx.throw(BAD_REQUEST, "Entity type not identifiable");
        }
      }
      if (
        (ctx.state.entityUpdate ||
          ctx.path.includes("/update/") ||
          ctx.path.endsWith("/update")) &&
        !ctx.request.body.currentAlias &&
        ctx.request.body.alias
      ) {
        ctx.request.body.currentAlias = ctx.request.body.alias;
      } else if (
        !ctx.state.entityUpdate &&
        !ctx.path.includes("/update/") &&
        !ctx.path.endsWith("/update") &&
        ctx.request.body.currentAlias
      ) {
        delete ctx.request.body.currentAlias;
      }

      ctx.request.body = {
        ...ctx.request.body,
        alias: thisAlias,
        autoAlias: ctx.request.body.autoAlias === "true" ? true : false,
      };
    } else {
      ctx.throw(NOT_ACCEPTABLE, "Entity type not defined");
    }
  }
  if (!next) return;
  await next();
};
export { aliasInjector };
