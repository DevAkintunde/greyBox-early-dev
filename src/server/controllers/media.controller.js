import sequelize from "../config/db.config.js";
import {
  NOT_FOUND,
  NO_CONTENT,
  OK,
  SERVER_ERROR,
} from "../constants/statusCodes.js";
import { logger } from "../utils/logger.js";
import fs from "node:fs";
import path from "node:path";

const resolve = (p) => path.join("public", p);

export const upload = async (ctx, next) => {
  if (Object.keys(ctx.request.files).length > 0) {
    try {
      let newMedia = await sequelize.transaction(async (t) => {
        let createdMedia = await Promise.all(
          Object.keys(ctx.request.files).map(async (file) => {
            let thisFile = sequelize.models[ctx.state.entityType].create(
              {
                ...ctx.request.body,
                path: ctx.request.files[file].filepath,
              },
              { transaction: t }
            );
            return (await thisFile).toJSON();
          })
        );
        return createdMedia[0];
      });
      ctx.state.data = newMedia;
    } catch (err) {
      logger.error(err);
      ctx.state.error = err;
    }
    await next();
  } else {
    ctx.status = NO_CONTENT;
    ctx.message = "No media present in upload";
    return;
  }
};

export const viewItem = async (ctx, next) => {
  try {
    let thisMedia = await sequelize.models[ctx.state.entityType].findOne({
      where: ctx.request.body,
    });
    if (thisMedia) {
      ctx.status = OK;
      ctx.state.data = thisMedia.toJSON();
    }
  } catch (err) {
    logger.error(err);
    ctx.state.error = err;
  }
  await next();
};

export const updateItem = async (ctx, next) => {
  try {
    let updatedMedia = await sequelize.transaction(async (t) => {
      let thisMedia = await sequelize.models[ctx.state.entityType].findOne({
        where: { alias: ctx.request.body.alias },
      });

      Object.keys(ctx.request.files) &&
        Object.keys(ctx.request.files).length > 0 &&
        Object.keys(ctx.request.files).forEach((file) => {
          if (ctx.request.files[file].filepath !== resolve(thisMedia.path)) {
            fs.unlinkSync(resolve(thisMedia.path), (err) => {
              if (err) ctx.throw(500, err);
            });
            thisMedia.update({ path: ctx.request.files[file].filepath });
          }
        });
    });

    console.log("updatedMedia.toJSON()", updatedMedia.toJSON());
    ctx.state.data = updatedMedia.toJSON();
  } catch (err) {
    logger.error(err);
    ctx.state.error = err;
  }
  await next();
};

export const deleteItem = async (ctx, next) => {
  try {
    let thisMedia = await sequelize.models[ctx.state.entityType].findOne({
      where: ctx.request.body,
    });
    fs.unlinkSync(thisMedia.path, (err) => {
      if (err) {
        ctx.status = SERVER_ERROR;
        ctx.message = "Unable to delete media";
        return;
      }
    });
    thisMedia.destroy();
  } catch (err) {
    logger.error(err);
    ctx.state.error = err;
  }
  await next();
};

export const updateAlias = async (ctx, next) => {
  try {
    let thisMedia = await sequelize.models[ctx.state.entityType].findOne({
      where: { alias: ctx.request.body.currentAlias },
    });
    if (thisMedia) {
      thisMedia.update({ alias: ctx.request.body.alias });
      ctx.status = OK;
      ctx.state.data = thisMedia.toJSON();
    } else {
      ctx.state.error = {
        status: NOT_FOUND,
      };
    }
  } catch (err) {
    logger.error(err);
    ctx.state.error = err;
  }
  await next();
};
