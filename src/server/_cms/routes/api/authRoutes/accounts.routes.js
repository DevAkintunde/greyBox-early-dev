/* Admin Accounts management */
import {
  OK,
  UNAUTHORIZED,
  CREATED,
  CONFLICT,
  SERVICE_UNAVAILABLE,
  NOT_MODIFIED,
  BAD_REQUEST,
  NOT_FOUND,
  NOT_ACCEPTABLE,
} from "../../../constants/statusCodes.js";
import * as formValidator from "../../../validators/adminAccountFormValidator.js";
import checkAccount from "../../../middlewares/accounts/checkAccount.js";
import * as accountController from "../../../controllers/account.controller.js";

import Router from "@koa/router";
import validator from "validator";
import { accountsManagement } from "../../../middlewares/privileges/adminUsers.js";
import { urlQueryTranslator } from "../../../middlewares/urlQueryTranslator.js";
import Admin from "../../../models/entities/accounts/Admin.model.js";
import sequelize from "../../../config/db.config.js";
import UserAccessTimestamps from "../../../models/utils/UserAccessTimestamps.model.js";
import { logger } from "../../../utils/logger.js";
const router = new Router({
  prefix: "/accounts",
});
/*
Role definations:
    0. inactive role/null
    1. probation
    2. staff (staff and client officers)
    3. manager
    4. executive
    5. dev
*/

router.use(accountsManagement);

//fetch all accounts
router.get(
  "/",
  async (ctx, next) => {
    if (ctx.path === ctx.originalUrl) {
      ctx.originalUrl =
        ctx.originalUrl + "?sort[created=ASC]&page[limit=10]&include=role";
    }
    await next();
  },
  urlQueryTranslator,
  async (ctx, next) => {
    //inject acccount access timestamps model
    if (ctx.state.data) {
      await sequelize.transaction(async (t) => {
        let getTimestamps = [];
        let getTimestampsIDs = [];
        ctx.state.data.admin.forEach((account) => {
          getTimestampsIDs.push(account.dataValues.uuid);
          getTimestamps.push(
            UserAccessTimestamps.findByPk(account.dataValues.uuid, {
              transaction: t,
            })
          );
        });
        getTimestampsIDs = await Promise.all(getTimestamps);
        //convert getTimestampsIDs to object
        let UsersAccessTimestamps = {};
        getTimestampsIDs.forEach((userTimestamp) => {
          if (userTimestamp && userTimestamp.dataValues)
            UsersAccessTimestamps = {
              ...UsersAccessTimestamps,
              [userTimestamp.dataValues.account_id]: userTimestamp,
            };
        });
        let dataUpdated = [];
        ctx.state.data.admin.forEach((account) => {
          if (UsersAccessTimestamps[account.uuid]) {
            account.dataValues.access = UsersAccessTimestamps[account.uuid];
          }
          dataUpdated.push(account);
        });
        ctx.state.data.admin = dataUpdated;
      });
    }
    next();
  },
  (ctx) => {
    if (ctx.state.data) {
      ctx.status = OK;
      ctx.body = {
        status: OK,
        data: ctx.state.data,
      };
      return;
    }
    ctx.status = BAD_REQUEST;
    return;
  }
);

//view per admin user
router.get(
  "/:email",
  async (ctx, next) => {
    const thisAccount = await sequelize.transaction(async (t) => {
      const thisAccountProfile = await Admin.findByPk(ctx.params.email, {
        transaction: t,
      });
      let accessTimestamps;
      if (thisAccountProfile instanceof Admin)
        accessTimestamps = await UserAccessTimestamps.findByPk(
          thisAccountProfile.dataValues.uuid,
          {
            transaction: t,
          }
        );
      return {
        ...thisAccountProfile.toJSON(),
        access: accessTimestamps ? accessTimestamps.toJSON() : null,
      };
    });
    if (thisAccount) {
      ctx.state.data = { data: thisAccount };
    } else {
      ctx.state.error = { statusText: "User not found." };
    }
    await next();
  },
  (ctx) => {
    if (ctx.state.error) {
      ctx.status = BAD_REQUEST;
      ctx.message = ctx.state.error.statusText;
      return;
    }
    if (!ctx.state.data) {
      ctx.status = NOT_FOUND;
      return (ctx.body = {});
    }
    ctx.status = OK;
    ctx.body = {
      status: OK,
      ...ctx.state.data,
    };
    return;
  }
);

//create new admin account
router.post(
  "/create",
  async (ctx, next) => {
    if (ctx.request.body && ctx.request.body.role)
      ctx.request.body.role = Number(ctx.request.body.role);
    await next();
  },
  formValidator.createAccount,
  async (ctx, next) => {
    ctx.state.userType = "Admin";
    await next();
  },
  checkAccount(false),
  async (ctx, next) => {
    if (ctx.state.error) {
      if (ctx.state.error.status === CONFLICT) {
        ctx.status = CONFLICT;
        ctx.message = "Account already registered";
        return;
      } else {
        ctx.status = ctx.state.error.status;
        ctx.message = ctx.state.error.message;
        return;
      }
    }
    await next();
  },
  accountController.createAccount,
  (ctx) => {
    if (ctx.state.newUser) {
      let profileData = {
        status: CREATED,
        profile: ctx.state.newUser.toJSON(),
        message: "Account created.",
      };
      ctx.status = OK;
      return (ctx.body = profileData);
    } else {
      ctx.status = SERVICE_UNAVAILABLE;
      ctx.message = "Account creation failed.";
      return;
    }
  }
);

//block or suspend an admin account
router.get("/:email/block", async (ctx, next) => {
  try {
    if (validator.isEmail(ctx.params.email)){
      await sequelize.transaction(async (t) => {
        const thisAccount = await Admin.findByPk(ctx.params.email, {
          transaction: t,
        });
        if (!thisAccount.dataValues.role < 5) {
          ctx.status = NOT_ACCEPTABLE;
          ctx.message = "Dev accounts not allowed to be suspended";
          return;
        } else {
          thisAccount.update({ state: false });
          ctx.status = OK;
          ctx.body = { status: OK, statusText: "Account suspended" };
          return;
        }
      });
    }else{
      ctx.throw(BAD_REQUEST, 'Unable to resolve account to block')
    }
  } catch (err) {
    logger.error("Account suspension error: ", err);
    ctx.status = SERVICE_UNAVAILABLE;
    ctx.message = "Unable to suspend account";
    return;
  }
});

export default router;
