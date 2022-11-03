"use strict";
const {
  OK, CREATED,
  UNAUTHORIZED, BAD_REQUEST,
  CONFLICT, FORBIDDEN,
  NOT_FOUND, SERVER_ERROR,
} = require("../../../constants/statusCodes");
const { logger } = require("../../../utils/logger");
const {
  signin: signinFormValidator,
  update: updateFormValidator,
  changePassword: updatePasswordValidator,
  resetPassword: resetPasswordValidator,
  create: createFormValidator
} = require("../../../validators/adminAccountFormValidator");
const { BASE_URL, API_ENDPOINT } = require('../../../utils/secrets');
const { generate } = require('../../../utils/token');
const { bearerTokenJwtAuth } = require('../../../middlewares/authorization/tokenAuth')
const accountController = require("../../../controllers/account.controller");
const checkAccount = require("../../../middlewares/accounts/checkAccount");
//const shorteningService = require("./shorteningService.route");
const urlQueryTranslator = require("../../../middlewares/urlQueryTranslator");
// model
const Admin = require("../../../models/entities/accounts/Admin.model");
//modules
const passport = require("koa-passport");
// Router
const Router = require("@koa/router");
const router = new Router({
  prefix: "/admin",
});

// Signed In landing page
router.get("/",
bearerTokenJwtAuth,
(ctx) => {
  if (ctx.isUnauthenticated()) {
    ctx.status = UNAUTHORIZED;
    return (ctx.body = { message: "Unauthorised. User not Signed In" });
  }
  return (ctx.body = { status: OK, profile: ctx.state.user });
});

// account sign in
router.post(
  "/signin",
  signinFormValidator,
  async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.status = OK
      return (ctx.body = { 
      status: OK, profile: ctx.state.user,
      message: 'Account is already Signed In.' });
    }
    passport.userType = "Admin";
    if (ctx.header['x-requesttoken'] === '*') {
      passport.useRequesttoken = true;
    }
    return passport.authenticate("local", (err, user, info) => {
      if (err) {
        logger.error('Error:', err);
        ctx.status = SERVER_ERROR;
        return (ctx.body = {
          status: SERVER_ERROR
        });
      }
      if (!user) {
        ctx.status = NOT_FOUND;
        return (ctx.body = { message: "User not found" });
        //ctx.throw(401);
      } else {
        //console.log("user: ", user.toJSON());
        let profileData = { 
          status: OK, 
          profile: {...user.toJSON(), 
            type: 'Admin'},
        }
        if (ctx.header['x-requesttoken'] === '*') {
          const token = generate(profileData.profile);
          profileData = {
            ...profileData,
            token: token,
          }
          ctx.status = OK
          return ctx.body = profileData;
        } else {
          ctx.login(profileData.profile);
        }
        //ctx.status = OK
        //return ctx.body = profileData;
      }
    })(ctx);
  }
);

// sign out account
router.delete("/signout",
bearerTokenJwtAuth,
(ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logOut();
    ctx.status = OK;
    return (ctx.body = { message: "Successful" });
  } else {
    ctx.status = CONFLICT;
    return (ctx.body = { message: "User already Signed Out" });
  }
});

// account update
router.patch(
  "/update",
  bearerTokenJwtAuth,
  async (ctx, next) => {
    if (ctx.isUnauthenticated()) {
      ctx.status = UNAUTHORIZED;
      return (ctx.body = { message: "Unauthorised. User not Signed In" });
    }
    await next();
    if (ctx.state.updatedUser) {
      ctx.logIn({...ctx.state.updatedUser,
      type: 'Admin'})
      ctx.status = OK;
      return (ctx.body = {
        status: OK,
        message: "Successful.",
        profile: ctx.state.user,
      });
    }
  },
  updateFormValidator,
  accountController.update
);
//account update password only
router.patch(
  "/update-password",
  bearerTokenJwtAuth,
  async (ctx, next) => {
    if (ctx.isUnauthenticated()) {
      ctx.status = UNAUTHORIZED;
      return (ctx.body = { message: "Unauthorised. User not Signed In" });
    }
    await next();
  },
  updatePasswordValidator,
  accountController.updatePassword
);
//account reset password
router.patch(
  "/reset-password",
  bearerTokenJwtAuth,
  async (ctx, next) => {
    if (ctx.isAuthenticated()) {
      ctx.status = UNAUTHORIZED;
      return (ctx.body = { message: "User already Signed In" });
    }
    await next();
  },
  resetPasswordValidator,
  accountController.resetPassword
);

// verify account activation
// GET: /verify?filter[id=akin@thin.city]&filter[code=gjU866bi35h]
router.get(
  "/verify",
  async (ctx, next) => {
    await next();
    //console.log("query result: ", ctx.state.queryData);
    //ctx.body = ctx.state.queryData;
  },
  urlQueryTranslator,
  async (ctx, next) => {
    if (!ctx.state.queryData) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {
        status: NOT_FOUND,
        message: "Verification code may have expired or does not exist.",
      });
    }
    await next();
  },
  async (ctx, next) => {
    ctx.request.body = { email: ctx.state.queryData.OTP[0].id };
    await next();
  },
  checkAccount(true),
  async (ctx, next) => {
    if (ctx.state.error) {
      if (ctx.state.error.code === CONFLICT) {
        ctx.status = OK;
        return (ctx.body = {
          status: ctx.state.error.code,
          message: "Account already verified. Sign in to continue.",
        });
      } else if (ctx.state.error.code === NOT_FOUND) {
        ctx.status = ctx.state.error.code;
        return (ctx.body = {
          status: ctx.state.error.code,
          message: "Oops! Account not found",
        });
      } else {
        ctx.status = ctx.state.error.code;
        return (ctx.body = {
          status: ctx.state.error.code,
          message: ctx.state.error.message,
        });
      }
    }
    let verifyAccount = Admin.findByPk(ctx.state.queryData.OTP[0].id);
    await verifyAccount.update({
      status: true,
      markForDeletionBy: null,
    });
    console.log("verified Acc:", verifyAccount.toJSON());
    //if (verifyAccount.dataValues.status) {
      ctx.status = OK;
        return (ctx.body = {
          status: OK,
          message: "Account verified.",
        });
    //}
  }
);

// Third parties signin
router.get('/signwith/:app',
(ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.status = OK
    return (ctx.body = { 
    status: OK, profile: ctx.state.user,
    message: 'Account is already Signed In.' });
  }
  next();
},
async (ctx) => {
  passport.userType = "Admin";
return passport.authenticate(ctx.params.app, { scope: ['profile', 'email'] })(ctx)
}
)

router.get('/signwith/:app/callback',
async (ctx, next) => {
  //console.log('this request: ', ctx.header)
  await next();
  //const token = generate({ profile: ctx.state.user });
    //console.log('token @google:: ', token)
  ctx.status = OK
  return (ctx.body = { status: OK, 
    profile: ctx.state.user,
    //token: token 
  });
},
async (ctx) => {
  passport.userType = "Admin";
return passport.authenticate(ctx.params.app, (err, user, info, status) => {
      if (err) {
        logger.error('Error:', err);
        ctx.status = SERVER_ERROR;
        return (ctx.body = {
          status: SERVER_ERROR,
          message: err.message,
        });
      }
      if (!user) {
        ctx.status = NOT_FOUND;
        return (ctx.body = { message: "Unable to signin using the account." });
        //ctx.throw(401);
      } else {
        //console.log("user: ", user.toJSON());
        let profileData = { 
          status: OK, 
          profile: {...user.toJSON(), 
            type: 'Admin'},
        }
        if (ctx.header['x-requesttoken'] === '*') {
          const token = generate(profileData.profile);
          profileData = {
            ...profileData,
            token: token,
          }
          ctx.status = OK
          return ctx.body = profileData;
        } else {
          ctx.login(profileData.profile);
        }
      }
    })(ctx);
}
)

//create new admin account
router.post(
  "/create-account",
  createFormValidator,
  checkAccount(false),
  async (ctx, next) => {
    console.log('hello 112222')
    if (ctx.state.error) {
      if (ctx.state.error.code === CONFLICT) {
        ctx.status = CONFLICT;
        return (ctx.body = {
          status: CONFLICT,
          message: "Conflict. Account already registered.",
        });
      } else {
        ctx.status = ctx.state.error.code;
        return (ctx.body = {
          status: ctx.state.error.code,
          message: ctx.state.error.message,
        });
      }
    }
 
    await next();
    //console.log('uuuuuuse:: ', ctx.state.newUser)
    if (ctx.state.newUser) {
      console.log("new user: ", ctx.state.newUser.toJSON());
        let profileData = { 
          status: CREATED, 
          profile: ctx.state.newUser.toJSON(),
          message: "Account created."
        }
        ctx.status = OK
        return ctx.body = profileData;
    } else {
      ctx.status = SERVER_ERROR;
      return (ctx.body = {
        status: SERVER_ERROR,
        message: "Account creation failed.",
      });
    }
  },
  accountController.create
);


// Admin Privileged managerial routes
// All managerial pages should be sufficed as purview.
const purview = require("../purview");
router.use(purview.routes());

module.exports = router;

