import { logger } from "../../utils/logger.js";
import Admin from "../../models/entities/accounts/Admin.model.js";
import Page from "../../models/entities/nodes/StaticPage.model.js";
import EntityStatus from "../../models/fields/EntityStatus.model.js";
import OTP from "../../models/utils/OTP.model.js";
import Paragraph from "../../models/entities/paragraphs/Paragraph.model.js";
import Image from "../../models/entities/paragraphs/Image.model.js";
import pImage from "../../models/entities/paragraphs/Image.model.js";
import pText from "../../models/entities/paragraphs/Text.model.js";
import pVideo from "../../models/entities/paragraphs/Video.model.js";

const modelsSync = async () => {
  // if dev mode.
  try {
    //await Account.sync({ alter: true });
    //await Admin.sync({ alter: true });

    await EntityStatus.sync({ force: true });
    await OTP.sync({ force: true });
    await Page.sync({ force: true });
    await Admin.sync({ force: true });
    await Paragraph.sync({ force: true });

    //dependents
    await Image.sync({ force: true });
    await pImage.sync({ force: true });
    await pText.sync({ force: true });
    await pVideo.sync({ force: true });

    logger.info("All tables synced as needed!");
    console.log("All tables synced as needed!");
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
  }
  // if production mode
  // rather than delete and recreate table, update it to fit updated models.
  // await Admin.sync({ alter: true });
};

modelsSync();
