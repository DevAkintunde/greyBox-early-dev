import { logger } from "../../utils/logger.js";
import sequelize from "../../config/db.config.js";
import { hash } from "../../utils/password.js";
import { getOffsetTimestamp } from "../../functions/getOffsetTimestamp.js";
import Status from "../../models/fields/EntityStatus.model.js";
import Admin from "../../models/entities/accounts/Admin.model.js";
import OTP from "../../models/utils/OTP.model.js";
import Page from "../../models/entities/nodes/StaticPage.model.js";
import VideoSource from "../../models/fields/VideoSource.model.js";
import Role from "../../models/fields/UserRole.model.js";

async function defaultTablesUp() {
  // status options
  const statusOptions = [
    { key: "draft", value: "Draft" },
    { key: "in_review", value: "In Review" },
    { key: "published", value: "Published" },
    { key: "unpublished", value: "Unpublished" },
    { key: "deleted", value: "Deleted" },
  ];

  const videoTypes = [
    { key: "hosted", value: "Upload to Server" },
    { key: "youtube", value: "YouTube Video" },
    { key: "vimeo", value: "Vimeo Video" },
  ];
  const roles = [
    { key: 0, value: "Inactive" },
    { key: 1, value: "Probation" },
    { key: 2, value: "Staff (staff and client officers)" },
    { key: 3, value: "Manager" },
    { key: 4, value: "Executive" },
    { key: 5, value: "dev" },
  ];

  const defaultAdmin = {
    firstName: "Akintunde",
    lastName: "EB",
    email: "ebakintunde@gmail.com",
    password: hash("accounts"),
    role: 4,
    state: true,
  };
  const defaultDev = {
    firstName: "Akintunde",
    lastName: "Akin",
    email: "devakintunde@gmail.com",
    password: hash("accounts"),
    role: 5,
    state: true,
  };

  const dummyOTP = {
    code: "codeVerifier",
    ref: "Account",
    id: "ebakintunde@gmail.com",
    markForDeletionBy: getOffsetTimestamp("-24"),
    log: "Account verification",
  };
  const dummyPage = {
    title: "About page",
    featuredImageUri:
      "https://media-exp1.licdn.com/dms/image/C5103AQFL2vyjJvJWeg/profile-displayphoto-shrink_200_200/0/1516844334563?e=1661385600&v=beta&t=GwWX9ShqF2tqJ8rPS63g3M-pp9zqv3nXZLKKPibRiw4",
    summary: "summary content goes here...",
    //body: "This is the body of this page content. Nice....",
    alias: "about",
    status: "draft",
    author: "ebakintunde@gmail.com",
  };
  const defaultTablesUp = async () => {
    try {
      return sequelize.transaction(async (t) => {
        await Status.bulkCreate(statusOptions, { transaction: t });
        await Role.bulkCreate(roles, { transaction: t });
        await VideoSource.bulkCreate(videoTypes, { transaction: t });
        await Admin.create(defaultDev, { transaction: t });
        await Admin.create(defaultAdmin, { transaction: t });
        logger.info("Default Tables UP");
      });
      //return doTablesUp;
    } catch (err) {
      logger.error({ on: "Default models", log: err.message });
      console.log("Error, Default models: ", err.message);
      //return err;
    }
  };
  let mainTable = defaultTablesUp();
  setTimeout(async () => {
    if (mainTable) {
      try {
        return sequelize.transaction(async (t) => {
          await OTP.create(dummyOTP, { transaction: t });
          await Page.create(dummyPage, { transaction: t });
          logger.info("Dependent Tables UP");
        });
        //return dependents;
      } catch (err) {
        logger.error({ on: "dependent models", log: err.message });
        console.log("Error, dependent models: ", err.message);
        return err;
      }
    }
  }, 10000);
}

defaultTablesUp();
