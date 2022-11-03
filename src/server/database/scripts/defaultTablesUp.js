const { logger } = require("../../utils/logger");
const sequelize = require("../../config/db.config");
const { hash } = require("../../utils/password");
const markForDeletion = require("../../functions/markForDeletion");
const State = require("../../models/fields/dbFields/EntityStatus.model");
const Admin = require("../../models/entities/accounts/Admin.model");
const OTP = require("../../models/OTP.model");
//const Blog = require("../../models/Blog.model");
const Page = require("../../models/entities/nodes/StaticPage.model");

async function defaultTablesUp() {
  // state/status options
  const stateOptions = [
    { key: "draft", state: "Draft" },
    { key: "in_review", state: "In Review" },
    { key: "published", state: "Published" },
    { key: "unpublished", state: "Unpublished" },
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
    body: "This is the body of this page content. Nice....",
    alias: "about",
    state: "draft",
    author: "ebakintunde@gmail.com",
  };
  /*
  const dummyBlog = {
    title: "Blog page",
    featuredImageUri:
      "https://media-exp1.licdn.com/dms/image/C5103AQFL2vyjJvJWeg/profile-displayphoto-shrink_200_200/0/1516844334563?e=1661385600&v=beta&t=GwWX9ShqF2tqJ8rPS63g3M-pp9zqv3nXZLKKPibRiw4",
    summary: "summary content goes here...",
    body: "This is the body of this page content. Nice....",
    alias: "blog",
    state: "draft",
    author: "ebakintunde@gmail.com",
  };*/

  const defaultTablesUp = async () => {
    try {
      doTablesUp = await sequelize.transaction(async (t) => {
        await State.bulkCreate(stateOptions, { transaction: t });
        await Admin.create(defaultDev, { transaction: t });
        await Admin.create(defaultAdmin, { transaction: t });
        logger.info("Default Tables UP");
      });
      return doTablesUp;
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
        await sequelize.transaction(async (t) => {
          await OTP.create(dummyOTP, { transaction: t });
          await Page.create(dummyPage, { transaction: t });
          //await Blog.create(guestUser, { transaction: t });
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
