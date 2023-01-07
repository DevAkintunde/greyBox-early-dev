import { logger } from "../../../_cms/utils/logger.js";
import Service from "../../models/Service.model.js";
import ServiceType from "../../models/fields/ServiceType.model.js";

const modelsDump = async () => {
  // if dev mode.
  try {
    await Service.drop();
    await ServiceType.drop();
    logger.info("App Tables dumpped!");
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
  }
};

modelsDump();
