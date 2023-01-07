import sequelize from "../config/db.config.js";
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
import { logger } from "../utils/logger.js";
import { UUID4Validator } from "../functions/UUID4Validator.js";
import Image from "../models/entities/media/Image.model.js";
import Video from "../models/entities/media/Video.model.js";
//node models
import Blog from "../models/entities/nodes/Blog.model.js";
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
        let createdNode = await sequelize.transaction(async (t) => {
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
          let nodeParagraphs = await Promise.all(paragraphsBundle);
          let paragraphRelations = [];
          for (let i = 0; i < nodeParagraphs.length; i++) {
            paragraphRelations.push({
              ...nodeParagraphs[i].toJSON(),
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

          const node = await sequelize.models[ctx.state.nodeType].create(
            modelAttributes,
            {
              transaction: t,
            }
          );
          return {
            data: node.toJSON(),
            type: ctx.state.nodeType.toLowerCase(),
            relations: { body: paragraphRelations },
          };
        });
        ctx.state.data = createdNode;
      } else {
        logger.info(
          "Node Controller:",
          "Unable to identify paragraph body type as object."
        );
        ctx.state.error = {
          status: BAD_REQUEST,
          statusText: "Unable to identify paragraph body type as object.",
        };
      }
    } else {
      try {
        const node = await sequelize.models[ctx.state.nodeType].create(
          modelAttributes
        );
        ctx.state.data = {
          data: node.toJSON(),
          type: ctx.state.nodeType.toLowerCase(),
        };
      } catch (err) {
        logger.error("Node Controller:", err);
        ctx.state.error = {
          status: SERVER_ERROR,
          statusText: err.parent ? err.parent.detail : err.message,
        };
      }
    }
  } catch (err) {
    logger.error("Node Controller:", err);
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
        let updateNoded = await sequelize.transaction(async (t) => {
          let node = await sequelize.models[ctx.state.nodeType].findOne(
            {
              where: {
                [searchKey === "currentAlias" ? "alias" : searchKey]:
                  modelAttributes[searchKey],
              },
            },
            {
              transaction: t,
            }
          );

          if (node) {
            let parentParagraph;
            if (node.dataValues.body) {
              parentParagraph = node.dataValues.body;
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
            let nodeParagraphs = await Promise.all(paragraphsBundle);
            let paragraphRelations = [];
            for (let i = 0; i < nodeParagraphs.length; i++) {
              paragraphRelations.push({
                ...nodeParagraphs[i].toJSON(),
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

            //console.log("nodeParagraphs", nodeParagraphs);
            //console.log("paragraphRelations", paragraphRelations);

            node.set(modelAttributes, {
              transaction: t,
            });
            node.changed("updated", true);
            node.save();
            return {
              data: node.toJSON(),
              type: ctx.state.nodeType.toLowerCase(),
              relations: { body: paragraphRelations },
            };
          } else {
            return NOT_FOUND;
          }
        });
        if (updateNoded === NOT_FOUND) {
          return (ctx.state.error = {
            status: BAD_REQUEST,
            message: `The ${ctx.state.nodeType.toLowerCase()} you are looking for does not exist.`,
          });
        }
        ctx.state.data = updateNoded;
      } else {
        ctx.state.error = {
          status: BAD_REQUEST,
          message: "Unable to identify paragraph body type as object.",
        };
      }
    } else {
      try {
        let updateNoded = await sequelize.transaction(async (t) => {
          let searchKey = ctx.request.body.uuid ? "uuid" : "currentAlias";
          let node = await sequelize.models[ctx.state.nodeType].findOne(
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
          if (node.dataValues.body) {
            try {
              await Paragraph.destroy(
                { where: { uuid: node.dataValues.body } },
                { transaction: t }
              );
            } catch (err) {
              logger.error("Node Controller deleting paragraph error:", err);
            }
          }
          node.set(modelAttributes, {
            transaction: t,
          });
          node.changed("updated", true);
          node.save();
          return { data: node, type: ctx.state.nodeType.toLowerCase() };
        });
        ctx.state.data = updateNoded;
      } catch (err) {
        logger.error("Node Controller:", err);
        ctx.state.error = {
          status: SERVER_ERROR,
          message: err.parent ? err.parent.detail : err.message,
        };
      }
    }
  } catch (err) {
    logger.error("Node Controller:", err);
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
    let thisNode = await sequelize.models[ctx.state.nodeType].findOne({
      where: {
        [searchKey === "currentAlias" ? "alias" : searchKey]:
          ctx.request.body[searchKey],
      },
    });
    if (thisNode instanceof sequelize.models[ctx.state.nodeType]) {
      thisNode.update({
        alias: ctx.request.body.alias,
        autoAlias: false,
        last_revisor: ctx.state.user.email,
      });
      ctx.status = OK;
      ctx.state.data = thisNode.toJSON();
    } else {
      ctx.state.error = {
        status: NOT_FOUND,
        statusText: `The ${ctx.state.nodeType.toLowerCase()} to be updated does not seem to exist`,
      };
    }
  } catch (err) {
    logger.error("Node Controller", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: `Unable to update ${ctx.state.nodeType.toLowerCase()} alias`,
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
    let thisNode = await sequelize.models[ctx.state.nodeType].findOne({
      where: {
        [searchKey === "currentAlias" ? "alias" : searchKey]:
          ctx.request.body[searchKey],
      },
    });
    if (thisNode instanceof sequelize.models[ctx.state.nodeType]) {
      thisNode.update({
        status: ctx.request.body.status,
        state: status === "published" ? true : false,
        last_revisor: ctx.state.user.email,
      });
      ctx.status = OK;
      ctx.state.data = thisNode.toJSON();
    } else {
      ctx.state.error = {
        status: NOT_FOUND,
        statusText: `The ${ctx.state.nodeType.toLowerCase()} to be updated does not seem to exist`,
      };
    }
  } catch (err) {
    logger.error("Node Controller", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      statusText: `Unable to update ${ctx.state.nodeType.toLowerCase()} status`,
    };
  }
  await next();
};

//soft delete node using paranoid approach
//it will be permanently deleted by cron after 30 days.
export const deleteItem = async (ctx, next) => {
  try {
    let deletionCall = await sequelize.models[ctx.state.nodeType].destroy({
      where: ctx.request.body,
    });
    if (!deletionCall) {
      ctx.state.error = {
        status: SERVICE_UNAVAILABLE,
        statusText: `Unable to delete ${ctx.state.nodeType.toLowerCase()} node`,
      };
    }
  } catch (err) {
    logger.error("Node deletion error: ", err);
    ctx.state.error = {
      status: BAD_REQUEST,
      message: err.parent ? err.parent.detail : err.message,
    };
  }
  await next();
};

// Node entity view
export const viewItem = async (ctx, next) => {
  try {
    let node = await sequelize.transaction(async (t) => {
      const thisNode = await sequelize.models[ctx.state.nodeType].findOne(
        { where: ctx.request.body },
        { transaction: t }
      );
      if (thisNode && thisNode.dataValues && thisNode.dataValues.body) {
        let nodeRelations = [];
        let [text, image, video] = await Promise.all([
          PText.findAll(
            { where: { parent: thisNode.dataValues.body } },
            { transaction: t }
          ),
          PImage.findAll(
            { where: { parent: thisNode.dataValues.body } },
            { transaction: t }
          ),
          PVideo.findAll(
            { where: { parent: thisNode.dataValues.body } },
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
              nodeRelations.push({
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
        nodeRelations.sort((a, b) => a.weight - b.weight);
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
            ? { body: nodeRelations, media: mediaFetcher }
            : { body: nodeRelations };
        return {
          data: thisNode.toJSON(),
          type: ctx.state.nodeType.toLowerCase(),
          relations: relations,
        };
      }
      if (thisNode && thisNode.dataValues)
        return {
          data: thisNode.toJSON(),
          type: ctx.state.nodeType.toLowerCase(),
        };
      return null;
    });
    ctx.status = OK;
    ctx.state.data = node;
  } catch (err) {
    logger.error("Node Controller", err);
    ctx.state.error = {
      status: err && err.status ? err.status : BAD_REQUEST,
      statusText:
        err && err.statusText ? err.statusText : "Error fetching node entity",
    };
  }
  await next();
};
