const sequelize = require("../../config/db.config");
const StaticPage = require("../../models/contents/StaticPage.model");
const Status = require("../../models/fields/EntityStatus.model");
const Paragraph = require("../../models/paragraphs/Paragraph.model");
const PText = require("../../models/paragraphs/Text.model");
const PImage = require("../../models/paragraphs/Image.model");
const PVideo = require("../../models/paragraphs/Video.model");
const {
  BAD_REQUEST,
  SERVER_ERROR,
  OK,
  NOT_FOUND,
} = require("../../constants/statusCodes");
const markForDeletion = require("../../functions/markForDeletion");
const { logger } = require("../../utils/logger");

exports.create = async (ctx) => {
  try {
    let { state } = ctx.request.body;
    const checkStatus = await Status.findByPk(state);
    let modelAttributes = ctx.request.body;
    if (!checkStatus) {
      modelAttributes = {
        ...modelAttributes,
        state: "draft",
        author: ctx.state.user.uuid,
      };
    }
    if (modelAttributes.body) {
      if (
        Array.isArray(modelAttributes.body) &&
        modelAttributes.body.length > 0
      ) {
        createdPage = await sequelize.transaction(async (t) => {
          const newParagraph = await Paragraph.create({ transaction: t });
          let parentParagraph = newParagraph.dataValues.uuid;
          let paragraphsBundle = [];
          let paragraphsID = [];
          modelAttributes.body.forEach((paragraph, index) => {
            if (paragraph.validated) {
              let thisType = paragraph.type;
              let thisModelType =
                "P" +
                thisType.substring(1, 0).toUpperCase() +
                thisType.substring(1);
              //exclude type value from been forwarded to ORM
              delete paragraph.type;
              //remove validation checker from validator.
              delete paragraph.validated;

              const paragraphData = {
                ...paragraph,
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
        return (ctx.state.page = createdPage);
      } else {
        return (ctx.state.error = {
          status: BAD_REQUEST,
          message: "Paragraphs must be an array in the expected view order.",
        });
      }
    } else {
      try {
        const page = await StaticPage.create(modelAttributes);
        return (ctx.state.page = { ...page.toJSON(), type: "page" });
      } catch (err) {
        logger.error("Page Controller", err);
        return (ctx.state.error = {
          status: SERVER_ERROR,
          message: err.parent ? err.parent.detail : err.message,
        });
      }
    }
  } catch (err) {
    logger.error("Page Controller", err);

    //console.log("Page 222::", JSON.stringify(err, null, 2));
    return (ctx.state.error = {
      status: SERVER_ERROR,
      message: err.parent ? err.parent.detail : err.message,
    });
  }
};

exports.update = async (ctx) => {
  try {
    let { state } = ctx.request.body;
    const checkStatus = await Status.findByPk(state);
    let modelAttributes = ctx.request.body;
    if (!checkStatus) {
      modelAttributes = {
        ...modelAttributes,
        state: "draft",
        last_revisor: ctx.state.user.uuid,
      };
    }
    if (modelAttributes.body) {
      if (
        Array.isArray(modelAttributes.body) &&
        modelAttributes.body.length > 0
      ) {
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
            modelAttributes.body.forEach((paragraph, index) => {
              if (paragraph.validated) {
                let thisType = paragraph.type;
                let thisModelType =
                  "P" +
                  thisType.substring(1, 0).toUpperCase() +
                  thisType.substring(1);
                //exclude type value from been forwarded to ORM
                delete paragraph.type;
                //remove validation checker from validator.
                delete paragraph.validated;

                const paragraphData = {
                  ...paragraph,
                  parent: parentParagraph,
                  weight: index,
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
                      .then(() => {
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
            if (modelAttributes.body && modelAttributes.body.length > 0) {
              modelAttributes.body = parentParagraph;
            } else {
              delete modelAttributes.body;
            }

            page.set(modelAttributes, {
              transaction: t,
            });
            page.changed("updated", true);
            page.save();
            return {
              ...page.toJSON(),
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
        return (ctx.state.page = updatePaged);
      } else {
        return (ctx.state.error = {
          status: BAD_REQUEST,
          message: "Paragraphs must be an array in the expected view order.",
        });
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
          return { ...page, type: "page" };
        });
        return (ctx.state.page = updatePaged);
      } catch (err) {
        logger.error("Page Controller", err);
        return (ctx.state.error = {
          status: SERVER_ERROR,
          message: err.parent ? err.parent.detail : err.message,
        });
      }
    }
  } catch (err) {
    logger.error("Page Controller", err);
    return (ctx.state.error = {
      status: SERVER_ERROR,
      message: err.parent ? err.parent.detail : err.message,
    });
  }
};

exports.updateAlias = async (ctx) => {
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

exports.updateState = async (ctx) => {
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

exports.delete = async (ctx) => {
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
exports.view = async (ctx) => {
  let { alias } = ctx.request.body;

  try {
    let page = await sequelize.transaction(async (t) => {
      const thisPage = await StaticPage.findOne(
        { where: { alias: alias } },
        { transaction: t }
      );
      if (thisPage && thisPage.dataValues.body) {
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
        let getParagraphs = [text, image, video];
        let paragraphIds = ["text", "image", "video"];
        for (let i = 0; i < getParagraphs.length; i++) {
          const paragraphArray = getParagraphs[i];
          paragraphArray.forEach((paragraph) => {
            if (paragraph) {
              pageRelations.push({
                ...paragraph.toJSON(),
                type: paragraphIds[i],
              });
            }
          });
        }
        pageRelations.sort((a, b) => a.weight - b.weight);
        return {
          ...thisPage.toJSON(),
          type: "page",
          relations: { body: pageRelations },
        };
      }
      return { ...thisPage.toJSON(), type: "page" };
    });
    return (ctx.state.page = page);
  } catch (err) {
    logger.error("Page Controller", err);
    return (ctx.state.error = err);
  }
};
