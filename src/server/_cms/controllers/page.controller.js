import sequelize from "../config/db.config.js";
import StaticPage from "../models/entities/nodes/StaticPage.model.js";
import Status from "../models/fields/EntityStatus.model.js";
import Paragraph from "../models/entities/paragraphs/Paragraph.model.js";
import PText from "../models/entities/paragraphs/PText.model.js";
import PImage from "../models/entities/paragraphs/PImage.model.js";
import PVideo from "../models/entities/paragraphs/PVideo.model.js";
import {
  BAD_REQUEST,
  SERVER_ERROR,
  OK,
  NOT_FOUND,
  SERVICE_UNAVAILABLE,
} from "../constants/statusCodes.js";
import { markForDeletion } from "../functions/markForDeletion.js";
import { logger } from "../utils/logger.js";
import { UUID4Validator } from "../functions/UUID4Validator.js";
import Image from "../models/entities/media/Image.model.js";
import Video from "../models/entities/media/Video.model.js";
import Page from "../models/entities/nodes/StaticPage.model.js";

export const createItem = async (ctx, next) => {
  try {
    let { status } = ctx.request.body;
    let checkStatus;
    if (status) {
      checkStatus = await Status.findByPk(status);
    }
    let modelAttributes = ctx.request.body;
    if (!checkStatus || !checkStatus.dataValues)
      modelAttributes.status = "draft";
    if (status === "published") modelAttributes.state = true;
    modelAttributes.author = ctx.state.user.email;

    if (modelAttributes.body) {
      if (Object.keys(modelAttributes.body).length > 0) {
        let createdPage = await sequelize.transaction(async (t) => {
          const newParagraph = await Paragraph.create({ transaction: t });
          let parentParagraph = newParagraph.dataValues.uuid;
          let paragraphsBundle = [];
          let paragraphsID = [];
          Object.keys(modelAttributes.body).forEach((paragraphId, index) => {
            let thisType;
            let thisModelType;
            let paragraph;
            if (
              modelAttributes.body[paragraphId]["text"] &&
              modelAttributes.body[paragraphId]["text"].validated
            ) {
              thisType = "text";
              thisModelType = "Ptext";
              //remove validation checker from validator.
              delete modelAttributes.body[paragraphId]["text"].validated;
              paragraph = modelAttributes.body[paragraphId]["text"];
            } else if (
              modelAttributes.body[paragraphId]["image"] &&
              modelAttributes.body[paragraphId]["image"].validated
            ) {
              thisType = "image";
              thisModelType = "Pimage";
              delete modelAttributes.body[paragraphId]["image"].validated;
              paragraph = modelAttributes.body[paragraphId]["image"];
            } else if (
              modelAttributes.body[paragraphId]["video"] &&
              modelAttributes.body[paragraphId]["video"].validated
            ) {
              thisType = "video";
              thisModelType = "Pvideo";
              delete modelAttributes.body[paragraphId]["video"].validated;
              paragraph = modelAttributes.body[paragraphId]["video"];
            }
            if (thisType && thisModelType && paragraph) {
              const paragraphData = {
                ...paragraph,
                parent: parentParagraph,
              };
              paragraphsBundle.push(
                sequelize.models[thisModelType].create(paragraphData, {
                  transaction: t,
                })
              );
              paragraphsID.push(thisType);
            }
          });
          let pageParagraphs = await Promise.all(paragraphsBundle);
          let paragraphRelations = [];
          for (let i = 0; i < pageParagraphs.length; i++) {
            paragraphRelations.push({
              ...pageParagraphs[i].toJSON(),
              type: paragraphsID[i],
            });
          }
          if (
            modelAttributes.body &&
            Object.keys(modelAttributes.body).length > 0 &&
            parentParagraph
          ) {
            modelAttributes.body = parentParagraph;
          } else {
            delete modelAttributes.body;
          }

          const page = await StaticPage.create(modelAttributes, {
            transaction: t,
          });
          return {
            data: page.toJSON(),
            type: "page",
            relations: { body: paragraphRelations },
          };
        });
        ctx.state.data = createdPage;
      } else {
        logger.info(
          "Page Controller:",
          "Unable to identify paragraph body type as object."
        );
        ctx.state.error = {
          status: BAD_REQUEST,
          statusText: "Unable to identify paragraph body type as object.",
        };
      }
    } else {
      try {
        const page = await StaticPage.create(modelAttributes);
        ctx.state.data = { data: page.toJSON(), type: "page" };
      } catch (err) {
        logger.error("Page Controller:", err);
        ctx.state.error = {
          status: SERVER_ERROR,
          statusText: err.parent ? err.parent.detail : err.message,
        };
      }
    }
  } catch (err) {
    logger.error("Page Controller:", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: err.parent ? err.parent.detail : err.message,
    };
  }
  await next();
};

export const updateItem = async (ctx, next) => {
  try {
    let { status } = ctx.request.body;
    let checkStatus;
    if (status) {
      checkStatus = await Status.findByPk(status);
    }
    let modelAttributes = ctx.request.body;
    if (!checkStatus || !checkStatus.dataValues)
      modelAttributes.status = "draft";
    if (status === "published") modelAttributes.state = true;
    modelAttributes.last_revisor = ctx.state.user.email;

    if (modelAttributes.body) {
      if (Object.keys(modelAttributes.body).length > 0) {
        let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
        let updatePaged = await sequelize.transaction(async (t) => {
          let page = await StaticPage.findOne(
            {where: {
              [searchKey === "currentAlias" ? "alias" : searchKey]:
              modelAttributes[searchKey],
            },},
            {
              transaction: t,
            }
          );

          if (page) {
            let parentParagraph;
            if (page.dataValues.body) {
              parentParagraph = page.dataValues.body;
            } else {
              let newParagraph = await Paragraph.create({ transaction: t });
              parentParagraph = newParagraph.dataValues.uuid;
            }
            let paragraphsBundle = [];
            let paragraphsID = [];
            Object.keys(modelAttributes.body).forEach((paragraphId) => {
              let thisType;
              let thisModelType;
              let paragraph;
              if (
                modelAttributes.body[paragraphId]["text"] &&
                modelAttributes.body[paragraphId]["text"].validated
              ) {
                thisType = "text";
                thisModelType = "Ptext";
                //remove validation checker from validator.
                delete modelAttributes.body[paragraphId]["text"].validated;
                paragraph = modelAttributes.body[paragraphId]["text"];
                if (UUID4Validator(paragraphId)) paragraph.uuid = paragraphId;
              } else if (
                modelAttributes.body[paragraphId]["image"] &&
                modelAttributes.body[paragraphId]["image"].validated
              ) {
                thisType = "image";
                thisModelType = "Pimage";
                delete modelAttributes.body[paragraphId]["image"].validated;
                paragraph = modelAttributes.body[paragraphId]["image"];
                if (UUID4Validator(paragraphId)) paragraph.uuid = paragraphId;
              } else if (
                modelAttributes.body[paragraphId]["video"] &&
                modelAttributes.body[paragraphId]["video"].validated
              ) {
                thisType = "video";
                thisModelType = "Pvideo";
                delete modelAttributes.body[paragraphId]["video"].validated;
                paragraph = modelAttributes.body[paragraphId]["video"];
                if (UUID4Validator(paragraphId)) paragraph.uuid = paragraphId;
              }
              if (thisType && thisModelType && paragraph) {
                const paragraphData = {
                  ...paragraph,
                  parent: parentParagraph,
                };
                if (!paragraph.uuid) {
                  paragraphsBundle.push(
                    sequelize.models[thisModelType].create(paragraphData, {
                      transaction: t,
                    })
                  );
                  paragraphsID.push(thisType);
                } else {
                  paragraphsBundle.push(
                    sequelize.models[thisModelType]
                      .update(
                        paragraphData,
                        { where: { uuid: paragraph.uuid } },
                        { transaction: t }
                      )
                      .then((res) => {
                        return sequelize.models[thisModelType].findByPk(
                          paragraph.uuid
                        );
                      })
                  );
                  paragraphsID.push(thisType);
                }
              }
            });
            let pageParagraphs = await Promise.all(paragraphsBundle);
            let paragraphRelations = [];
            for (let i = 0; i < pageParagraphs.length; i++) {
              paragraphRelations.push({
                ...pageParagraphs[i].toJSON(),
                type: paragraphsID[i],
              });
            }
            if (
              modelAttributes.body &&
              Object.keys(modelAttributes.body).length > 0 &&
              parentParagraph
            ) {
              modelAttributes.body = parentParagraph;
            } else {
              delete modelAttributes.body;
            }

            console.log("pageParagraphs", pageParagraphs);
            console.log("paragraphRelations", paragraphRelations);

            page.set(modelAttributes, {
              transaction: t,
            });
            page.changed("updated", true);
            page.save();
            return {
              data: page.toJSON(),
              type: "page",
              relations: { body: paragraphRelations },
            };
          } else {
            return NOT_FOUND;
          }
        });
        if (updatePaged === NOT_FOUND) {
          return (ctx.state.error = {
            status: BAD_REQUEST,
            message: "The page you are looking for does not exist.",
          });
        }
        ctx.state.data = updatePaged;
      } else {
        ctx.state.error = {
          status: BAD_REQUEST,
          message: "Unable to identify paragraph body type as object.",
        };
      }
    } else {
      try {
        let updatePaged = await sequelize.transaction(async (t) => {
          let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
          let page = await StaticPage.findOne(
            {
              where: {
                [searchKey === "currentAlias" ? "alias" : searchKey]:
                  ctx.request.body[searchKey],
              },
            },
            {
              transaction: t,
            }
          );
          if (page.dataValues.body) {
            try {
              await Paragraph.destroy(
                { where: { uuid: page.dataValues.body } },
                { transaction: t }
              );
            } catch (err) {
              logger.error("Page Controller deleting paragraph error:", err);
            }
          }
          page.set(modelAttributes, {
            transaction: t,
          });
          page.changed("updated", true);
          page.save();
          return { data: page, type: "page" };
        });
        ctx.state.data = updatePaged;
      } catch (err) {
        logger.error("Page Controller:", err);
        ctx.state.error = {
          status: SERVER_ERROR,
          message: err.parent ? err.parent.detail : err.message,
        };
      }
    }
  } catch (err) {
    logger.error("Page Controller:", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      message: err.parent ? err.parent.detail : err.message,
    };
  }
  await next();
};

export const updateAlias = async (ctx, next) => {
  try {
    let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
    let thisPage = await sequelize.models[ctx.state.entityType].findOne({
      where: {
        [searchKey === "currentAlias" ? "alias" : searchKey]:
          ctx.request.body[searchKey],
      },
    });
    if (thisPage instanceof Page) {
      thisPage.update({
        alias: ctx.request.body.alias,
        autoAlias: false,
        last_revisor: ctx.state.user.email,
      });
      ctx.status = OK;
      ctx.state.data = thisPage.toJSON();
    } else {
      ctx.state.error = {
        status: NOT_FOUND,
        statusText: "The page to be updated does not seem to exist",
      };
    }
  } catch (err) {
    logger.error("Page Controller", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: "Unable to update page alias",
    };
  }
  await next();
};

export const updateStatus = async (ctx, next) => {
  try {
    let { status } = ctx.request.body;
    let checkStatus;
    if (status) {
      checkStatus = await Status.findByPk(status);
    }
    if (!checkStatus || !checkStatus.dataValues)
      ctx.request.body.status = "draft";

    let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
    let thisPage = await sequelize.models[ctx.state.entityType].findOne({
      where: {
        [searchKey === "currentAlias" ? "alias" : searchKey]:
          ctx.request.body[searchKey],
      },
    });
    if (thisPage instanceof Page) {
      thisPage.update({
        status: ctx.request.body.status,
        state: status === "published" ? true : false,
        last_revisor: ctx.state.user.email,
      });
      ctx.status = OK;
      ctx.state.data = thisPage.toJSON();
    } else {
      ctx.state.error = {
        status: NOT_FOUND,
        statusText: "The page to be updated does not seem to exist",
      };
    }
  } catch (err) {
    logger.error("Page Controller", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: "Unable to update page status",
    };
  }
  await next();
};

//soft delete page using paranoid approach
//it will be permanently deleted by cron after 30 days.
export const deleteItem = async (ctx, next) => {
  try {
    let deletionCall = await StaticPage.destroy({ where: ctx.request.body });
    if (!deletionCall) {
      ctx.state.error = {
        status: SERVICE_UNAVAILABLE,
        statusText: "Unable to delete page entity",
      };
    }
  } catch (err) {
    ctx.state.error = {
      status: BAD_REQUEST,
      message: err.parent ? err.parent.detail : err.message,
    };
  }
  await next();
};

// Page entity view
export const viewItem = async (ctx, next) => {
  try {
    let page = await sequelize.transaction(async (t) => {
      const thisPage = await StaticPage.findOne(
        { where: ctx.request.body },
        { transaction: t }
      );
      if (thisPage && thisPage.dataValues && thisPage.dataValues.body) {
        let pageRelations = [];
        let [text, image, video] = await Promise.all([
          PText.findAll(
            { where: { parent: thisPage.dataValues.body } },
            { transaction: t }
          ),
          PImage.findAll(
            { where: { parent: thisPage.dataValues.body } },
            { transaction: t }
          ),
          PVideo.findAll(
            { where: { parent: thisPage.dataValues.body } },
            { transaction: t }
          ),
        ]);
        //media relations of paragraphs
        let imagesMedia = [];
        let videosMedia = [];
        let getParagraphs = [text, image, video];
        let paragraphIds = ["text", "image", "video"];
        for (let i = 0; i < getParagraphs.length; i++) {
          const paragraphArray = getParagraphs[i];
          paragraphArray.forEach((paragraph) => {
            if (paragraph) {
              pageRelations.push({
                data: paragraph.toJSON(),
                type: paragraphIds[i],
              });
            }
            if (
              paragraph.dataValues &&
              paragraph.dataValues[paragraphIds[i]] &&
              UUID4Validator(paragraph.dataValues[paragraphIds[i]])
            ) {
              if (paragraphIds[i] === "image")
                imagesMedia.push(paragraph.dataValues[paragraphIds[i]]);
              if (paragraphIds[i] === "video")
                videosMedia.push(paragraph.dataValues[paragraphIds[i]]);
            }
          });
        }
        pageRelations.sort((a, b) => a.weight - b.weight);
        let mediaFetcher = [];
        if (imagesMedia.length > 0) {
          let imageGroup = imagesMedia.map((image) => {
            return Image.findAll(
              { where: { uuid: image } },
              { transaction: t }
            );
          });
          await Promise.all(imageGroup).then((res) => {
            //findAll returns nested arrays. Open that up here
            let thisImages = [];
            res.forEach((array) => {
              thisImages = [...thisImages, ...array];
            });
            thisImages.forEach((image) => {
              mediaFetcher = [
                ...mediaFetcher,
                { data: image.toJSON(), type: "image" },
              ];
            });
          });
        }
        if (videosMedia.length > 0) {
          let videoGroup = videosMedia.map((video) => {
            return Video.findAll(
              { where: { uuid: video } },
              { transaction: t }
            );
          });
          await Promise.all(videoGroup).then((res) => {
            //findAll returns nested arrays. Open that up here
            let thisVideos = [];
            res.forEach((array) => {
              thisVideos = [...thisVideos, ...array];
            });
            thisVideos.forEach((video) => {
              mediaFetcher = [
                ...mediaFetcher,
                { data: video.toJSON(), type: "video" },
              ];
            });
          });
        }

        let relations =
          mediaFetcher.length > 0
            ? { body: pageRelations, media: mediaFetcher }
            : { body: pageRelations };
        return {
          data: thisPage.toJSON(),
          type: "page",
          relations: relations,
        };
      }
      if (thisPage && thisPage.dataValues)
        return { data: thisPage.toJSON(), type: "page" };
      return null;
    });
    ctx.status = OK;
    ctx.state.data = page;
  } catch (err) {
    logger.error("Page Controller", err);
    ctx.state.error = {
      status: err && err.status ? err.status : BAD_REQUEST,
      statusText:
        err && err.statusText ? err.statusText : "Error fetching entity",
    };
  }
  await next();
};
