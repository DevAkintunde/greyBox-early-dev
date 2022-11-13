/**
 * authorisation middleware for jwt option
 */
import { BAD_REQUEST, SERVER_ERROR } from "../../constants/statusCodes.js";
import { logger } from "../../utils/logger.js";
//modules
import passport from "koa-passport";

const bearerTokenJwtAuth = async (ctx, next) => {
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    //console.log('err info: ', info)
    if (info !== undefined) {
      ctx.status = BAD_REQUEST;
      ctx.message = info.message ? info.message : "Unresolved request.";
      return;
    }
    if (err) {
      logger.error("Error:", err);
      ctx.status = SERVER_ERROR;
    }
    ctx.state.user = user;
    return next();
  })(ctx, next);
};

export { bearerTokenJwtAuth };
