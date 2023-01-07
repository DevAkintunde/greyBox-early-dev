import { logger } from "../../utils/logger.js";
//accounts
import Admin from "../../models/entities/accounts/Admin.model.js";
// nodes
import Page from "../../models/entities/nodes/StaticPage.model.js";
import Blog from "../../models/entities/nodes/Blog.model.js";
// fields
import EntityStatus from "../../models/fields/EntityStatus.model.js";
import VideoSource from "../../models/fields/VideoSource.model.js";
// utils
import OTP from "../../models/utils/OTP.model.js";
import UserAccessTimestamps from "../../models/utils/UserAccessTimestamps.model.js";
// paragraphs
import Paragraph from "../../models/entities/paragraphs/Paragraph.model.js";
import PImage from "../../models/entities/paragraphs/PImage.model.js";
import PText from "../../models/entities/paragraphs/PText.model.js";
import PVideo from "../../models/entities/paragraphs/PVideo.model.js";
// medias
import Image from "../../models/entities/media/Image.model.js";
import Video from "../../models/entities/media/Video.model.js";
import UserRole from "../../models/fields/UserRole.model.js";

const modelsSync = async () => {
  // if dev mode.
  try {
    //await Account.sync({ alter: true });
    //await Admin.sync({ alter: true });

    await EntityStatus.sync({ force: true });
    await UserRole.sync({ force: true });
    await VideoSource.sync({ force: true });
    await OTP.sync({ force: true });
    await Admin.sync({ force: true });
    await UserAccessTimestamps.sync({ force: true });

    await Paragraph.sync({ force: true });

    //dependents
    await Image.sync({ force: true });
    await Video.sync({ force: true });
    //paragraphs dependents
    await PImage.sync({ force: true });
    await PText.sync({ force: true });
    await PVideo.sync({ force: true });

    await Page.sync({ force: true });
    await Blog.sync({ force: true });

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
