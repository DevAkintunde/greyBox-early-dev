import { logger } from "../../../_cms/utils/logger.js";
import Service from "../../models/Service.model.js";
import ServiceType from "../../models/fields/ServiceType.model.js";

const modelsSync = async () => {
  // if dev mode.
  try {
    await ServiceType.sync({ force: true });

    //dependents
    await Service.sync({ force: true });

    logger.info("App tables synced as needed!");
  } catch (err) {
    logger.error("App db table sync: ", err);
  }
  // if production mode
  // rather than delete and recreate table, update it to fit updated models.
  // await Admin.sync({ alter: true });
};

modelsSync();
