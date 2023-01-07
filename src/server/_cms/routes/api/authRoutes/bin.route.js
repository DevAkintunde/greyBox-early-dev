/* Scheduled for deletion entity routes 
  eclude for specific models like: PAGE
*/
// minimum level 3 permission.
import {
  OK,
  UNAUTHORIZED,
  SERVER_ERROR,
  NO_CONTENT,
  SERVICE_UNAVAILABLE,
} from "../../../constants/statusCodes.js";
import sequelize from "../../../config/db.config.js";
import Router from "@koa/router";
import { Op } from "sequelize";
import { logger } from "../../../utils/logger.js";
import Paragraph from "../../../models/entities/paragraphs/Paragraph.model.js";
import Page from "../../../models/entities/nodes/StaticPage.model.js";
import Blog from "../../../models/entities/nodes/Blog.model.js";
import { ModelMapper } from "../../../constants/ModelMapper.js";

const router = new Router({
  prefix: "/bin",
});

router.use(async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 3) {
    ctx.status = UNAUTHORIZED;
    ctx.body = {
      status: UNAUTHORIZED,
      statusText: "Admin user does not have the required permission.",
    };
    return;
  }
  await next();
});

//View all in Bin
router.get("/", async (ctx) => {
  try {
    let entityTypes = ModelMapper["nodes"];

    const Bin = await sequelize.transaction(async (t) => {
      let inBinPromises = [];
      entityTypes.forEach((model) => {
        inBinPromises.push(
          sequelize.models[model].findAll(
            {
              where: {
                deleted: {
                  [Op.not]: null,
                },
              },
              paranoid: false,
            },
            { transaction: t }
          )
        );
      });
      let binItems = await Promise.all(inBinPromises);
      let allInBin = {};
      binItems.forEach((node, index) => {
        allInBin = { ...allInBin, [entityTypes[index].toLowerCase()]: node };
      });
      return allInBin;
    });
    //console.log("bin", Bin);
    if (Bin && Object.keys(Bin).length > 0) {
      ctx.status = OK;
      ctx.body = { status: OK, data: Bin };
      return;
    } else {
      ctx.status = NO_CONTENT;
      ctx.message = "Nothing in bin!";
      return;
    }
  } catch (err) {
    logger.error("bin view all nodes: ", err);
    ctx.status = SERVER_ERROR;
    ctx.message = err.parent ? err.parent.detail : err.message;
    return;
  }
});

//View Bin per nodetype
router.get("/:entityType", async (ctx) => {
  try {
    let entityType =
      ctx.params.entityType.substring(0, 1).toUpperCase() +
      ctx.params.entityType.substring(1).toLowerCase();

    const Bin = await sequelize.transaction(async (t) => {
      const fetchEntities = await Promise.all([
        sequelize.models[entityType].findAll(
          {
            where: {
              deleted: {
                [Op.not]: null,
              },
            },
            paranoid: false,
          },
          { transaction: t }
        ),
      ]).then((res) => {
        //console.log('bin res', res)
        let [page] = res;
        return { page: page };
      });
      return fetchEntities;
    });
    if (Bin && Object.keys(Bin).length > 0) {
      ctx.status = OK;
      ctx.body = { status: OK, data: Bin };
      return;
    } else {
      ctx.status = NO_CONTENT;
      ctx.message = "Nothing in bin!";
      return;
    }
  } catch (err) {
    logger.error("bin view: ", err);
    ctx.status = SERVER_ERROR;
    ctx.message = err.parent ? err.parent.detail : err.message;
    return;
  }
});

//restore deleted single item/entity
router.get("/:entityType/:alias/restore", async (ctx) => {
  let entityType =
    ctx.params.entityType.substring(0, 1).toUpperCase() +
    ctx.params.entityType.substring(1).toLowerCase();
  let alias = ctx.params.alias;
  try {
    const entity = await sequelize.models[entityType].restore({
      where: {
        alias: alias,
      },
    });
    if (entity) {
      ctx.status = OK;
      ctx.body = { status: OK, statusText: "Restored" };
      return;
    } else {
      ctx.status = SERVICE_UNAVAILABLE;
      ctx.message = "Unable to restore content from bin.";
      return;
    }
  } catch (err) {
    logger.error("bin restore: ", err);
    ctx.status = SERVER_ERROR;
    ctx.message = err.parent ? err.parent.detail : err.message;
    return;
  }
});

//permanently delete single item/entity
router.delete("/:entityType/:alias/delete", async (ctx) => {
  let entityType =
    ctx.params.entityType.substring(0, 1).toUpperCase() +
    ctx.params.entityType.substring(1).toLowerCase();
  let alias = ctx.params.alias;
  try {
    const entityWithAssociation = await sequelize.transaction(async (t) => {
      const entity = await sequelize.models[entityType].findOne(
        { where: { alias: alias }, paranoid: false },
        { transaction: t }
      );

      let processDeletion = false;
      if (entity)
        if (entity.dataValues && entity.dataValues.body) {
          let deleteParagraph = await Paragraph.destroy(
            {
              where: { uuid: entity.dataValues.body },
            },
            { transaction: t }
          );
          if (deleteParagraph) processDeletion = true;
        } else {
          processDeletion = true;
        }
      if (processDeletion) {
        let deleteCall = entity.destroy({ force: true });
        return deleteCall;
      }
      ctx.status = SERVICE_UNAVAILABLE;
      ctx.message = "Unable to delete content from bin";
      return;
    });
    if (entityWithAssociation) {
      ctx.status = OK;
      ctx.body = { status: OK, statusText: "Permanently deleted" };
      return;
    } else {
      ctx.status = SERVICE_UNAVAILABLE;
      ctx.message = "Unable to delete content from bin";
      return;
    }
  } catch (err) {
    logger.error("bin permanent deletion: ", err);
    ctx.status = SERVER_ERROR;
    ctx.message = err.parent ? err.parent.detail : err.message;
    return;
  }
});

export default router;
