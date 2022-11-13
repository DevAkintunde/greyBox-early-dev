import sequelize from "../config/db.config.js";
import { OK } from "../constants/statusCodes.js";
import { logger } from "../utils/logger.js";

export const upload = async (ctx, next) => {
  try {
    let createdMedia = await sequelize.transaction(async (t) => {
      let createMedia = async (file) => {
        await Image.create(
          {
            ...ctx.request.body,
            path: ctx.request.files[file].filepath,
          },
          { transaction: t }
        );
      };
      ctx.request.files.forEach((file) => {
        createMedia(file);
      });
    });

    console.log("createdMedia.toJSON()", createdMedia.toJSON());
    ctx.state.media = createdMedia.toJSON();
  } catch (err) {
    logger.error(err);
    ctx.state.error = err;
  }
  await next();
};
