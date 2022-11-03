/**
 * authorisation middleware for jwt option
 */
const {
  OK, CREATED,
  UNAUTHORIZED, BAD_REQUEST,
  CONFLICT, FORBIDDEN,
  NOT_FOUND, SERVER_ERROR,
} = require("../../constants/statusCodes");
const { logger } = require("../../utils/logger");
//modules
const passport = require("koa-passport");

const bearerTokenJwtAuth = async (ctx, next) => {
  if (ctx.header['x-requesttoken'] !== '*') {
    return next();
  }
    return passport.authenticate("jwt", {session: false }, (err, user, info) => {
      //console.log('err info: ', info)
      if (info !== undefined) {
        ctx.status = BAD_REQUEST
        return ctx.body = {
          status: BAD_REQUEST,
          //message: "Authorization token no provided.",
          message: info.message? info.message: 'Unresolved request.'
        }
      }
      if (err) {
        logger.error('Error:', err);
        ctx.status = SERVER_ERROR;
        return (ctx.body = {
          status: SERVER_ERROR
        });
      }
      ctx.state.user = user;
      return next()
    })(ctx, next);
}

module.exports = { bearerTokenJwtAuth }
