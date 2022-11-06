import { logger } from "../utils/logger.js";
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
} from "../utils/secrets.js";
import { Sequelize } from "sequelize";

const profile = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
};

const sequelize = new Sequelize(
  profile.database,
  profile.user,
  profile.password,
  {
    host: profile.host,
    dialect: "postgres",
  }
);
//console.log("profile", profile);

const checkDBconnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    logger.info("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    logger.error("Unable to connect to the database:", error);
  }
};
//checkDBconnect();
//console.log(checkDBconnect());
export default sequelize;
