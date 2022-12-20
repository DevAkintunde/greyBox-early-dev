import {
  BAD_REQUEST,
  NOT_MODIFIED,
  OK,
} from "../../../../constants/statusCodes.js";

import Router from "@koa/router";
import Paragraph from "../../../../models/entities/paragraphs/Paragraph.model.js";
import sequelize from "../../../../config/db.config.js";
import { logger } from "../../../../utils/logger.js";
const router = new Router({
  prefix: "/paragraphs",
});

// Delete main paragraph parent
router.delete("/:uuid/delete", async (ctx) => {
  let uuid = ctx.params.uuid;

  try {
    let deleteParagraph = await Paragraph.destroy({ where: { uuid: uuid } });
    if (deleteParagraph === 1) {
      ctx.status = OK;
      ctx.body = {
        status: OK,
        statusText: "Success",
      };
    }
    ctx.status = NOT_MODIFIED;
    ctx.message = "Unable to delete paragraph";
    return;
  } catch (err) {
    logger.error("Paragraph Parent Deletion", err);
    ctx.status = BAD_REQUEST;
    ctx.message = "Unable to delete item";
    return;
  }
});

// Delete paragraph type
router.delete("/:type/:uuid/delete", async (ctx) => {
  let uuid = ctx.params.uuid;
  let type = "P" + ctx.params.type.toLowerCase();

  try {
    let deleteParagraph = await sequelize.models[type].destroy({
      where: { uuid: uuid },
    });
    if (deleteParagraph === 1) {
      ctx.status = OK;
      ctx.body = {
        status: OK,
        statusText: "Success",
      };
      return;
    }
    ctx.status = NOT_MODIFIED;
    ctx.message = `Unable to delete ${type}`;
    return;
  } catch (err) {
    logger.error("Paragraph Type Deletion", err);
    ctx.status = BAD_REQUEST;
    ctx.message = `Unable to delete ${type}`;
    return;
  }
});

export default router;
