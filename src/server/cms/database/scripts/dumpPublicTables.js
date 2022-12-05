import { logger } from "../../utils/logger.js";
import Status from "../../models/fields/EntityStatus.model";
import ServiceType from "../../models/fields/ServiceType.model";
import Role from "../../models/fields/UserRole.model";
import VideoSource from "../../models/fields/VideoSource.model";

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
