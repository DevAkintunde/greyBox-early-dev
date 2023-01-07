import cron from "node-cron";
import { clearExpiredOTP, emptyPageBin } from "./jobs/databaseTablePrune.js";
//import cron jobs from external app
import cronJobs from "../../app.cron.js";
import { logger } from "../utils/logger.js";

const jobScheduler = () => {
  //console.log("Cron just ran after an hour, 1hr.");
  /* imported cron jobs from app should be inserted by period.
    Undeclared period is assumed as day (24hrs cron interval) */

  //every 30mins cron
  cron.schedule("*/30 * * * *", () => {
    try {
      clearExpiredOTP();
      //external app cron
      cronJobs("*/30 * * * *");
      logger.info("Every 30mins cron initiated.");
    } catch (err) {
      logger.error("Every 30mins cron error: ", err);
    }
  });
  //hourly cron
  cron.schedule("0 * * * *", () => {
    try {
      emptyPageBin();
      //external app cron
      cronJobs("0 0 1 * *");
      logger.info("Hourly cron initiated.");
    } catch (err) {
      logger.error("Hourly cron error: ", err);
    }
  });
  //daily (24hrs) cron at 1am
  cron.schedule("0 1 * * *", () => {
    try {
      //external app cron
      cronJobs();
      logger.info("Daily cron initiated.");
    } catch (err) {
      logger.error("Daily cron error: ", err);
    }
  });
};

export { jobScheduler };
