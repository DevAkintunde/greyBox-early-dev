import sequelize from "../../../_cms/config/db.config.js";
import { logger } from "../../../_cms/utils/logger.js";
import Service from "../../models/Service.model.js";
import ServiceType from "../../models/fields/ServiceType.model.js";

async function defaultTablesUp() {
  let serviceTypes = [
    {
      key: "cinematography_lighting",
      value: "Cinematography & Lighting",
    },
    {
      key: "graphics",
      value: "Graphics",
    },
    {
      key: "live_stream",
      value: "Live Stream",
    },
    {
      key: "motion_graphics",
      value: "Motion Graphics",
    },
    {
      key: "photography",
      value: "Photography",
    },
    {
      key: "story_development",
      value: "Story Development",
    },
    {
      key: "videography",
      value: "Videography",
    },
    {
      key: "web_design",
      value: "Web Design",
    },
  ];

  const dummyService = {
    title: "About all services",
    featuredImage:
      "https://media-exp1.licdn.com/dms/image/C5103AQFL2vyjJvJWeg/profile-displayphoto-shrink_200_200/0/1516844334563?e=1661385600&v=beta&t=GwWX9ShqF2tqJ8rPS63g3M-pp9zqv3nXZLKKPibRiw4",
    summary: "summary content goes here...",
    //body: "This is the body of this page content. Nice....",
    alias: "services",
    type:'photography',
    status: "draft",
    author: "ebakintunde@gmail.com",
  };
  const defaultTablesUp = async () => {
    try {
      return sequelize.transaction(async (t) => {
        await ServiceType.bulkCreate(serviceTypes, { transaction: t });
        logger.info("App Default Tables UP");
      });
      //return doTablesUp;
    } catch (err) {
      logger.error("App Default models db tables create", err);
      //return err;
    }
  };
  let mainTable = defaultTablesUp();
  setTimeout(async () => {
    if (mainTable) {
      try {
        return sequelize.transaction(async (t) => {
          await Service.create(dummyService, { transaction: t });
          logger.info("App Dependent Tables UP");
        });
        //return dependents;
      } catch (err) {
        logger.error({ on: "app dependent models", log: err.message });
        return err;
      }
    }
  }, 10000);
}

defaultTablesUp();
