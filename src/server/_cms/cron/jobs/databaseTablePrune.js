import sequelize from "../../config/db.config.js";
import { logger } from "../../utils/logger.js";
import { Op } from "sequelize";
import Page from "../../models/entities/nodes/StaticPage.model.js";
import Paragraph from "../../models/entities/paragraphs/Paragraph.model.js";
import { getOffsetTimestamp } from "../../functions/getOffsetTimestamp.js";
import OTP from "../../models/utils/OTP.model.js";

export const emptyPageBin = async () => {
  try {
    const thirtyDaysAgo = getOffsetTimestamp("-30d");
    const pagesInBin = await sequelize.transaction(async (t) => {
      const entities = await Page.findAll(
        {
          where: {
            deleted: {
              [Op.not]: null,
            },
          },
          paranoid: false,
        },
        { transaction: t }
      );

      let filteredEntitiesForDeletion = [];
      entities.forEach((entity) => {
        if (entity.dataValues.deleted.getTime() < thirtyDaysAgo)
          filteredEntitiesForDeletion.push(entity);
      });

      //process deletion collection
      let pagesForDeletion = [];
      //delete dependent paragraph entities
      let paragraphsParents = [];
      //page uuid
      let parentPages = [];
      filteredEntitiesForDeletion.forEach((page) => {
        if (page.dataValues.body) {
          paragraphsParents.push(
            Paragraph.destroy(
              {
                where: { uuid: page.dataValues.body },
              },
              { transaction: t }
            )
          );
          parentPages.push(page);
        } else {
          pagesForDeletion.push(
            Page.destroy(
              {
                where: { uuid: page.dataValues.uuid },
                paranoid: false,
                force: true,
              },
              { transaction: t }
            )
          );
        }
      });

      //process deletion of paragraphs
      try {
        let paragraphDeletionCall = await Promise.all(paragraphsParents);
        paragraphDeletionCall.forEach((res, index) => {
          if (res === 1) {
            pagesForDeletion.push(
              Page.destroy(
                {
                  where: { uuid: parentPages[index].dataValues.uuid },
                  paranoid: false,
                  force: true,
                },
                { transaction: t }
              )
            );
          }
        });
      } catch (err) {
        logger.error(
          "cron deletion of paragraphs on pages causes error: ",
          err
        );
      }
      try {
        await Promise.all(pagesForDeletion);
        return 1;
      } catch (err) {
        logger.error("cron deletion of pages error: ", err);
      }
    });
    if (pagesInBin) {
      logger.info("Cron run deletion of page entities successful");
    } else {
      logger.info(
        "Unable to verify if cron run deletion of page entities is successful"
      );
    }
    return;
  } catch (err) {
    logger.error("cron deletion of pages error: ", err);
    return;
  }
};

export const clearExpiredOTP = async () => {
  try {
    const currentDate = Date.now();
    await OTP.destroy({
      where: {
        markForDeletionBy: {
          [Op.lt]: currentDate,
        },
      },
    });
    logger.info("Expired OTP cleared!");
  } catch (err) {
    logger.error("cron error occured when clearing OTP: ", err);
  }
};
