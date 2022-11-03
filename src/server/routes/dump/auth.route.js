const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const bcrypt = require("bcrypt");
const account = require("../models/Account.model");
const admin = require("../models/Admin.model");

const saltRounds = 10;

router.post("/signin", async (ctx, next) => {
  passport.authenticate("local", (err, user) => {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      return ctx.login(user);
    }
  })(ctx);
  await next();
});
/*
//Use for account modification operations
const authenticateAccount = async (ctx, next) => {
  console.log("path: ", ctx.path);
  console.log("headr: ", ctx.headers.authorization);
  const token = ctx.headers.authorization
    ? ctx.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    const { email } = verifyToken(token);
    let thisUser;
    if (email) {
      //console.log("path 2: " + req.baseUrl.split("/")[3]);
      if (req.baseUrl && req.baseUrl.split("/")[3] === "admin") {
        thisUser = await admin.scope("middleware").findByPk(email);
      } else {
        thisUser = await account.scope("middleware").findByPk(email);
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
      req.currentUser = thisUser;
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
*/
module.exports = router;
