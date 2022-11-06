import { error } from "../../utils/response.js";
import {
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
} from "../../constants/statusCodes.js";
import { verify as verifyToken } from "../../utils/token.js";
import admin from "../../models/entities/accounts/Admin.model.js";

//Use for account modification operations
const getCurrentAccount = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    const { email } = verifyToken(token);
    let thisUser;
    if (email) {
      //console.log("path 2: " + req.baseUrl.split("/")[3]);
      if (req.baseUrl && req.baseUrl.split("/")[3] === "admin") {
        thisUser = await admin.findByPk(email);
      } else {
        thisUser = await account.findByPk(email);
      }
    } else {
      return error({
        code: BAD_REQUEST,
        message: "An invalid request.",
        res,
      });
    }
    if (!thisUser) {
      return error({
        code: NOT_FOUND,
        message: "User not available.",
        res,
      });
    } else {
      req.currentUser = thisUser.toJSON();
    }
    next();
  } else {
    return error({
      code: UNAUTHORIZED,
      message: "Please sign in to process authentication.",
      res,
    });
  }
  next();
};
export default getCurrentAccount;
