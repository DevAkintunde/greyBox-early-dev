const { logger } = require("../../utils/logger");
const Admin = require("../../models/entities/accounts/Admin.model");
const Page = require("../../models/StaticPage.model");
//const Blog = require("../../models/Blog.model");
const EntityStatus = require("../../models/fields/dbFields/EntityStatus.model");
const OTP = require("../../models/OTP.model");

const modelsSync = async () => {
  // if dev mode.
  try {
    //await Account.sync({ alter: true });
    //await Admin.sync({ alter: true });

    await EntityStatus.sync({ force: true });
    await OTP.sync({ force: true });
    await Page.sync({ force: true });
    await Admin.sync({ force: true });
    //await Blog.sync({ force: true });

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
