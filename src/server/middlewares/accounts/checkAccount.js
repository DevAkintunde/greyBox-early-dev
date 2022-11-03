const Customer = require("../../models/accounts/Customer.model");
const Designer = require("../../models/accounts/Designer.model");
const Admin = require("../../models/accounts/Admin.model");
const {
  NOT_FOUND,
  CONFLICT,
  BAD_REQUEST,
  SERVER_ERROR,
} = require("../../constants/statusCodes");

//Use this to check the status/existence of an account on the server.

// the 'exist' argument is a boolean that should be specified when called as either true or false
// currentUser is passed to the header and can be used in any next middleware function.
const checkAccount = (existStatus) => async (ctx, next) => {
  const { email } = ctx.request.body;
  if (email) {
    try {
      let thisUser;
      if (ctx.state.userType === "Admin") {
        thisUser = await Admin.scope("middleware").findOne({
          where: {
            email: email,
          }
        });
      } else if (ctx.state.userType === "Designer"){
        thisUser = await Customer.scope("middleware").findOne({
          where: {
            email: email,
          }
        });
      }else if (ctx.state.userType === "Customer"){
        thisUser = await Customer.scope("middleware").findOne({
          where: {
            email: email,
          }
        });
      } else {
        ctx.throw(BAD_REQUEST, "Invalid account type")
      }
      if (existStatus && !thisUser) {
        ctx.state.error = {
          code: NOT_FOUND,
          message: "Oops! Account not found",
        };
      } else if (!existStatus && thisUser) {
        ctx.state.error = {
          code: CONFLICT,
          message: "Oops! Account already exist",
        };
      } /* else if (existStatus && thisUser && thisUser.email) {
        ctx.state.currentUser = thisUser;
      } */
      await next();
    } catch (err) {
      ctx.state.error = {
        code: SERVER_ERROR,
        message: "Server error.",
      };
    }
  } else {
    ctx.state.error = {
      code: BAD_REQUEST,
      message: "Please provide a valid email address.",
    };
  }
};

module.exports = checkAccount;
