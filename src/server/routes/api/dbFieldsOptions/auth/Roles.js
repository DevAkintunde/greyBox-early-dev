import Router from "@koa/router";
import {
  OK,
  SERVER_ERROR,
  UNAUTHORIZED,
} from "../../../../constants/statusCodes.js";
import Role from "../../../../models/fields/UserRole.model.js";

const router = new Router({
  prefix: "/roles",
});

router.get("/", async (ctx, next) => {
  if (ctx.state.user.role && Number(ctx.state.user.role) > 3) {
    try {
      let roles = await Role.findAll();
      if (roles) {
        ctx.status = OK;
        ctx.body = {
          status: OK,
          options: roles,
        };
        return;
      }
      ctx.status = OK;
      ctx.body = {
        status: OK,
        options: {},
      };
      return;
    } catch (err) {
      ctx.status = SERVER_ERROR;
      ctx.message = "Server error";
      return;
    }
  } else {
    ctx.status = UNAUTHORIZED;
    ctx.message = "Oops! Unauthorised access";
  }
});

export default router;
