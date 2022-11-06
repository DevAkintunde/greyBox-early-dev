import { logger } from "../../utils/logger.js";
import sequelize from "../../config/db.config.js";
import { hash } from "../../utils/password.js";
import { markForDeletion } from "../../functions/markForDeletion.js";
import State from "../../models/fields/EntityStatus.model.js";
import Admin from "../../models/entities/accounts/Admin.model.js";
import OTP from "../../models/utils/OTP.model.js";
import Page from "../../models/entities/nodes/StaticPage.model.js";

async function defaultTablesUp() {
  // state/status options
  const stateOptions = [
    { key: "draft", state: "Draft" },
    { key: "in_review", state: "In Review" },
    { key: "published", state: "Published" },
    { key: "unpublished", state: "Unpublished" },
    { key: "deleted", state: "Deleted" },
  ];

  const defaultAdmin = {
    firstName: "Akintunde",
    lastName: "EB",
    email: "ebakintunde@gmail.com",
    password: hash("accounts"),
    role: 4,
  };
  const defaultDev = {
    firstName: "Akintunde",
    lastName: "Akin",
    email: "devakintunde@gmail.com",
    password: hash("accounts"),
    role: 5,
  };

  const dummyOTP = {
    code: "codeVerifier",
    ref: "Account",
    id: "ebakintunde@gmail.com",
    markForDeletionBy: markForDeletion(24),
    log: "Account verification",
  };
  const dummyPage = {
    title: "About page",
    featuredImageUri:
      "https://media-exp1.licdn.com/dms/image/C5103AQFL2vyjJvJWeg/profile-displayphoto-shrink_200_200/0/1516844334563?e=1661385600&v=beta&t=GwWX9ShqF2tqJ8rPS63g3M-pp9zqv3nXZLKKPibRiw4",
    summary: "summary content goes here...",
    //body: "This is the body of this page content. Nice....",
    alias: "about",
    state: "draft",
    //author: "ebakintunde@gmail.com",
  };
  const defaultTablesUp = async () => {
    try {
      return sequelize.transaction(async (t) => {
        await State.bulkCreate(stateOptions, { transaction: t });
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
