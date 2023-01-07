import Admin from "../../models/entities/accounts/Admin.model.js";
import {
  NOT_FOUND,
  CONFLICT,
  BAD_REQUEST,
  SERVER_ERROR,
} from "../../constants/statusCodes.js";
import sequelize from "../../config/db.config.js";
import { logger } from "../../utils/logger.js";

//Use this to check the status/existence of an account on the server.

// the 'exist' argument is a boolean that should be specified when called as either true or false
// currentUser is passed to the header and can be used in any next middleware function.
const checkAccount = (existStatus) => async (ctx, next) => {
  const { email } = ctx.request.body;
  if (email) {
    try {
      let thisUser;
      if (ctx.state.userType) {
        thisUser = await sequelize.models[ctx.state.userType].findByPk(email);
      } else {
        ctx.status = BAD_REQUEST;
        ctx.message = "Unsure of account type to create";
        return;
      }
      if (existStatus && !thisUser) {
        ctx.state.error = {
          status: NOT_FOUND,
          message: "Oops! Account not found",
        };
      } else if (!existStatus && thisUser) {
        ctx.state.error = {
          status: CONFLICT,
          message: "Oops! Account already exist",
        };
      } /* else if (existStatus && thisUser && thisUser.email) {
        ctx.state.currentUser = thisUser;
      } */
      await next();
    } catch (err) {
      logger.error('Account checking error: ', err)
      ctx.status = SERVER_ERROR;
      ctx.message = "Server error";
    }
  } else {
    ctx.status = BAD_REQUEST;
    ctx.message = "Please provide a valid email address";
    return;
  }
};

export default checkAccount;
