import sequelize from "../config/db.config.js";
import {
  BAD_REQUEST,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  SERVER_ERROR,
} from "../constants/statusCodes.js";
import { logger } from "../utils/logger.js";
import fs from "node:fs";
import path from "node:path";
import Image from "../models/entities/media/Image.model.js";
import Video from "../models/entities/media/Video.model.js";
import VideoSource from "../models/fields/VideoSource.model.js";

const resolve = (p) => path.join("public", p);

export const upload = async (ctx, next) => {
  if (ctx.request.files && Object.keys(ctx.request.files).length > 0) {
    try {
      if (ctx.state.entityType === "Video") ctx.request.body.source = "hosted";

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
      if (ctx.request.files || ctx.request.body.styles) {
        let promises = [];
        const deleteMediaFromServer = (path) => {
          promises.push(fs.unlinkSync(resolve(path)));
        };
        if (ctx.request.body.styles)
          Object.keys(ctx.request.body.styles).forEach((stylePath) => {
            if (ctx.request.body.styles[stylePath])
              deleteMediaFromServer(ctx.request.body.styles[stylePath]);
          });
        if (ctx.request.files)
          Object.keys(ctx.request.files).forEach((file) => {
            //console.log('file: ', ctx.request.files[file])
            let filePath = ctx.request.files[file].filepath;
            //console.log('filePath: ', filePath)
            if (filePath) deleteMediaFromServer(filePath);
          });
        try {
          Promise.all(promises);
        } catch (err) {
          logger.error(
            "Media Controller, unable to remove uploaded media after failed creation on new media entity: ",
            err
          );
        }
      }
      logger.error("Media Controller, file upload: ", err);
      ctx.state.error = err;
    }
    await next();
  } else if (ctx.state.entityType && ctx.state.entityType === "Video") {
    try {
      let { source } = ctx.request.body;
      let checkSource;
      if (source) {
        checkSource = await VideoSource.findByPk(source);
      }
      if (!checkSource || !checkSource.dataValues) {
        let sourceFromUrl;
        if (ctx.request.body.path.toLowerCase().includes("/youtube")) {
          sourceFromUrl = "youtube";
        } else if (ctx.request.body.path.toLowerCase().includes("/vimeo")) {
          sourceFromUrl = "vimeo";
        }
        if (sourceFromUrl) {
          ctx.request.body.source = sourceFromUrl;
        } else {
          ctx.request.body.source = "";
        }
      }
      if (ctx.request.body.source) {
        let thisVideo = await sequelize.models["Video"].create(
          ctx.request.body
        );
        ctx.state.data = thisVideo;
      } else {
        ctx.throw(BAD_REQUEST, "Unable to identity source of the media.");
      }
    } catch (err) {
      logger.error("Media Controller, remote video creation error: ", err);
      ctx.state.error = err;
    }
    await next();
  } else {
    ctx.status = NO_CONTENT;
    ctx.statusText = "No media present in upload";
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
    logger.error("Media Controller, View: ", err);
    ctx.state.error = err;
  }
  await next();
};

export const updateItem = async (ctx, next) => {
  try {
    let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
    let updatedMedia = await sequelize.transaction(async (t) => {
      let thisMedia = await sequelize.models[ctx.state.entityType].findOne({
        where: {
          [searchKey === "currentAlias" ? "alias" : searchKey]:
            ctx.request.body[searchKey],
        },
      });

      if (
        thisMedia instanceof (ctx.state.entityType === "Image" ? Image : Video)
      ) {
        delete ctx.request.body[searchKey];

        if (
          ctx.request.files &&
          ctx.request.files.path &&
          ctx.request.files.path.filepath
        ) {
          if (ctx.request.files.path.filepath !== resolve(thisMedia.path)) {
            let promises = [];

            promises.push(fs.unlinkSync(resolve(thisMedia.path)));
            Object.keys(thisMedia.styles).forEach((stylePath) => {
              promises.push(
                fs.unlinkSync(resolve(thisMedia.styles[stylePath]))
              );
            });
            try {
              Promise.all(promises);
            } catch (err) {
              logger.error(err);
            }

            if (ctx.state.entityType === "Video")
              ctx.request.body.source = "hosted";
            thisMedia.update({
              ...ctx.request.body,
              path: ctx.request.files.path.filepath,
            });
          }
        } else {
          if (ctx.state.entityType === "Video") {
            try {
              let { source } = ctx.request.body;
              let checkSource;
              if (source) {
                checkSource = await VideoSource.findByPk(source);
              }
              if (!checkSource || !checkSource.dataValues) {
                let sourceFromUrl;
                if (ctx.request.body.path.toLowerCase().includes("/youtube")) {
                  sourceFromUrl = "youtube";
                } else if (
                  ctx.request.body.path.toLowerCase().includes("/vimeo")
                ) {
                  sourceFromUrl = "vimeo";
                }
                if (sourceFromUrl) {
                  ctx.request.body.source = sourceFromUrl;
                } else {
                  ctx.request.body.source = "";
                }
              }
              if (!ctx.request.body.source) {
                ctx.throw(
                  BAD_REQUEST,
                  "Unable to identity source of the media."
                );
              }
            } catch (err) {
              logger.error(
                "Media Controller, remote video update error: ",
                err
              );
              ctx.state.error = err;
            }
          }
          thisMedia.update(ctx.request.body);
        }
        return thisMedia;
      }
    });
    if (updatedMedia) {
      //console.log("updatedMedia.toJSON()", updatedMedia.toJSON());
      ctx.state.data = updatedMedia.toJSON();
    }
  } catch (err) {
    logger.error("Media Controller, update: ", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: "Unable to remove previous media from server",
    };
  }
  await next();
};

export const deleteItem = async (ctx, next) => {
  let thisMedia;
  try {
    thisMedia = await sequelize.models[ctx.state.entityType].findOne({
      where: ctx.request.body,
    });
    if (
      thisMedia &&
      (ctx.state.entityType === "Image" ||
        (ctx.state.entityType === "Video" &&
          thisMedia.dataValues.source === "hosted"))
    ) {
      let promises = [];
      promises.push(fs.unlinkSync(resolve(thisMedia.path)));
      if (ctx.state.entityType === "Image") {
        Object.keys(thisMedia.styles).forEach((stylePath) => {
          promises.push(fs.unlinkSync(resolve(thisMedia.styles[stylePath])));
        });
      }
      try {
        Promise.all(promises);
      } catch (err) {
        logger.error(err);
      }
    }
    thisMedia.destroy();
  } catch (err) {
    logger.error("Media Controller, delete: ", err);
    if (err.code === "ENOENT" && thisMedia) {
      let processDeletion = thisMedia.destroy();
      if (processDeletion === 1) await next();
    }
    ctx.state.error = {
      status: err && err.status ? err.status : SERVER_ERROR,
      statusText:
        err && err.statusText ? err.statusText : "Unable to delete media",
    };
  }
  await next();
};

export const updateAlias = async (ctx, next) => {
  try {
    let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
    let thisMedia = await sequelize.models[ctx.state.entityType].findOne({
      where: {
        [searchKey === "currentAlias" ? "alias" : searchKey]:
          ctx.request.body[searchKey],
      },
    });
    if (
      thisMedia instanceof (ctx.state.entityType === "Image" ? Image : Video)
    ) {
      thisMedia.update({ alias: ctx.request.body.alias, autoAlias: false });
      ctx.status = OK;
      ctx.state.data = thisMedia.toJSON();
    } else {
      ctx.state.error = {
        status: NOT_FOUND,
        statusText: "The media to be updated does not seem to exist",
      };
    }
  } catch (err) {
    logger.error("Media Controller, alias: ", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: "Unable to update media alias",
    };
  }
  await next();
};
