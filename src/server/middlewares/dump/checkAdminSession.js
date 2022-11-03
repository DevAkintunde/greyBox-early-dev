const { error } = require("../utils/response");
const {
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../constants/statusCodes");
const { verify: verifyToken } = require("../utils/token");
const admin = require("../models/Admin.model");

const checkAdminSession = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    const { email, role } = verifyToken(token);
    let thisUser;
    if (email && role) {
      thisUser = await admin.scope("middleware").findByPk(email);
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
        message: "This admin account is unavailable.",
        res,
      });
    } else {
      req.adminRole = thisUser.role;
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

module.exports = checkAdminSession;
