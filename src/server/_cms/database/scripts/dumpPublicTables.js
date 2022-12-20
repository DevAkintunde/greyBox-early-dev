import { logger } from "../../utils/logger.js";
import Status from "../../models/fields/EntityStatus.model.js";
import ServiceType from "../../models/fields/ServiceType.model.js";
import Role from "../../models/fields/UserRole.model.js";
import VideoSource from "../../models/fields/VideoSource.model.js";

const modelsDump = async () => {
  // if dev mode.
  try {
    //await Account.sync({ force: true });
    await Status.drop();
    await Role.drop();
    await VideoSource.drop();
    await ServiceType.drop();
    logger.info("Tables dumpped!");
    console.log("Tables dumpped!");
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
  }
};

modelsDump();
