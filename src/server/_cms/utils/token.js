import jwt from "jsonwebtoken";
import { JWEB_TOKEN_KEY } from "./secrets.js";
import { logger } from "./logger.js";
import { UNAUTHORIZED } from "../constants/statusCodes.js";

//console.log(require('crypto').randomBytes(64).toString('hex'));

const generate = (profile) =>
  jwt.sign(
    {
      profile,
    },
    JWEB_TOKEN_KEY,
    { expiresIn: "7d" }
  );

const verify = (token) => {
  return jwt.verify(token, JWEB_TOKEN_KEY, (err, decoded) => {
    if (err || !decoded) {
      const errorMsg = {
        code: UNAUTHORIZED,
        message:
          err && err.name && err.name === "TokenExpiredError"
            ? "Session expired. Please sign in."
            : "No authentication provided.",
      };
      console.log("err: ", err);
      logger.error(errorMsg);
      return errorMsg;
    }
    //console.log(decoded.email);
    return decoded;
  });
};

export { generate, verify };
