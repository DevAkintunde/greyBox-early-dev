import { logger } from "../../utils/logger.js";

const modelsDump = async () => {
  // if dev mode.
  try {
    //await Service.drop();
    logger.info("Tables dumpped!");
    console.log("Tables dumpped!");
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
  }
};

modelsDump();
