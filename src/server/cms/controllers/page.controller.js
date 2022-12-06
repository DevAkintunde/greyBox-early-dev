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
} from "../constants/statusCodes.js";
import { markForDeletion } from "../functions/markForDeletion.js";
import { logger } from "../utils/logger.js";
import { UUID4Validator } from "../functions/UUID4Validator.js";
import Image from "../models/entities/media/Image.model.js";
import Video from "../models/entities/media/Video.model.js";

export const createItem = async (ctx, next) => {
  try {
    let { status } = ctx.request.body;
    const checkStatus = await Status.findByPk(status);
    let modelAttributes = ctx.request.body;
    if (!checkStatus) {
      modelAttributes = {
        ...modelAttributes,
        status: "draft",
        author: ctx.state.user.email,
      };
    } else if (status.toLowerCase() === "publish") {
      modelAttributes = {
        ...modelAttributes,
        state: true,
        author: ctx.state.user.email,
      };
    } else {
      modelAttributes = {
        ...modelAttributes,
        author: ctx.state.user.email,
      };
    }

    if (modelAttributes.body) {
      if (Object.keys(modelAttributes.body).length > 0) {
        let createdPage = await sequelize.transaction(async (t) => {
          const newParagraph = await Paragraph.create({ transaction: t });
          let parentParagraph = newParagraph.dataValues.uuid;
          let paragraphsBundle = [];
          let paragraphsID = [];
          Object.keys(modelAttributes.body).forEach((paragraph, index) => {
            if (modelAttributes.body["paragraph"].validated) {
              let thisType = modelAttributes.body["paragraph"].type;
              let thisModelType = "P" + thisType.toLowerCase();
              //exclude type value from been forwarded to ORM
              delete modelAttributes.body["paragraph"].type;
              //remove validation checker from validator.
              delete modelAttributes.body["paragraph"].validated;

              const paragraphData = {
                ...modelAttributes.body["paragraph"],
                parent: parentParagraph,
                weight: index,
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
          //delete modelAttributes.body;

          const page = await StaticPage.create(
            {
              ...modelAttributes,
              body: parentParagraph,
            },
            {
              transaction: t,
            }
          );
          return {
            ...page.toJSON(),
            type: "page",
            relations: { body: paragraphRelations },
          };
        });
        ctx.state.data = createdPage;
      } else {
        logger.info(
          "Page Controller",
          "Paragraphs must be an array in the expected view order."
        );
        ctx.state.error = {
          status: BAD_REQUEST,
          statusText: "Paragraphs must be an array in the expected view order.",
        };
      }
    } else {
      try {
        const page = await StaticPage.create(modelAttributes);
        ctx.state.data = { ...page.toJSON(), type: "page" };
      } catch (err) {
        logger.error("Page Controller", err);
        ctx.state.error = {
          status: SERVER_ERROR,
          statusText: err.parent ? err.parent.detail : err.message,
        };
      }
    }
  } catch (err) {
    logger.error("Page Controller", err);

    console.log("Page 222::", JSON.stringify(err, null, 2));
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
    console.log("checkStatus", checkStatus);
    if (!checkStatus || !checkStatus.dataValues)
      modelAttributes.status = "draft";
    if (status === "published") modelAttributes.state = true;
    modelAttributes.last_revisor = ctx.state.user.email;

    if (modelAttributes.body) {
      if (Object.keys(modelAttributes.body).length > 0) {
        let updatePaged = await sequelize.transaction(async (t) => {
          let page = await StaticPage.findOne(
            { where: { alias: modelAttributes.alias } },
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
                        console.log("updated P resource", res);
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
              Object.keys(modelAttributes.body).length > 0
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
          let page = await StaticPage.findOne(
            { where: { alias: ctx.request.body.alias } },
            {
              transaction: t,
            }
          );
          page.set(modelAttributes, {
            transaction: t,
          });
          page.changed("updated", true);
          page.save();
          return { data: page, type: "page" };
        });
        ctx.state.data = updatePaged;
      } catch (err) {
        logger.error("Page Controller", err);
        ctx.state.error = {
          status: SERVER_ERROR,
          message: err.parent ? err.parent.detail : err.message,
        };
      }
    }
  } catch (err) {
    logger.error("Page Controller", err);
    ctx.state.error = {
      status: SERVER_ERROR,
      message: err.parent ? err.parent.detail : err.message,
    };
  }
  await next();
};

export const updateAlias = async (ctx) => {
  let { alias, currentAlias } = ctx.request.body;
  try {
    return sequelize.transaction(async (t) => {
      await StaticPage.update(
        { alias: alias },
        { where: { alias: currentAlias } },
        { transaction: t }
      ).then((res) => {
        let [updateRes] = res;
        return (ctx.body = updateRes);
      });
    });
  } catch (err) {
    return (ctx.state.error = {
      status: BAD_REQUEST,
      message: err.parent ? err.parent.detail : err.message,
    });
  }
};

export const updateStatus = async (ctx) => {
  let { alias, state } = ctx.request.body;
  try {
    return sequelize.transaction(async (t) => {
      await StaticPage.update(
        { state: state },
        { where: { alias: alias } },
        { transaction: t }
      ).then((res) => {
        let [updateRes] = res;
        return (ctx.body = updateRes);
      });
    });
  } catch (err) {
    return (ctx.state.error = {
      status: BAD_REQUEST,
      message: err.parent ? err.parent.detail : err.message,
    });
  }
};

export const deleteItem = async (ctx) => {
  let { alias } = ctx.request.body;
  try {
    let deletionDate = markForDeletion(30);
    return sequelize.transaction(async (t) => {
      await StaticPage.update(
        { markForDeletionBy: deletionDate, state: "deleted" },
        { where: { alias: alias } },
        { transaction: t }
      ).then((res) => {
        let [updateRes] = res;
        return (ctx.body = updateRes);
      });
    });
  } catch (err) {
    return (ctx.state.error = {
      status: BAD_REQUEST,
      message: err.parent ? err.parent.detail : err.message,
    });
  }
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
      return { data: thisPage.toJSON(), type: "page" };
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
