import "dotenv/config";
import { logger } from "./logger.js";

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  JWEB_TOKEN_KEY,
  BASE_URL,
  API_ENDPOINT,
  googleID,
  googleSECRET,
  fbID,
  fbSECRET,
  twitterKEY,
  twitterSECRET,
  inKEY,
  inSECRET,
} = process.env;

const requiredCredentials = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASS",
  "DB_NAME",
  "JWEB_TOKEN_KEY",
  "BASE_URL",
  "API_ENDPOINT",
];
//console.log("process.env", process.env.NODE_ENV);
for (const credential of requiredCredentials) {
  if (process.env[credential] === undefined) {
    logger.error(`Missing required crendential: ${credential}`);
    process.exit(1);
  }
}

export {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  JWEB_TOKEN_KEY,
  BASE_URL,
  API_ENDPOINT,
  googleID,
  googleSECRET,
  fbID,
  fbSECRET,
  twitterKEY,
  twitterSECRET,
  inKEY,
  inSECRET,
};
