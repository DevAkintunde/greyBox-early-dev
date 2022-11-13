import Router from "@koa/router";
import { OK, SERVER_ERROR } from "../../../../constants/statusCodes.js";
import Status from "../../../../models/fields/EntityStatus.model.js";

const router = new Router({
  prefix: "/statuses",
});

router.get("/", async (ctx, next) => {
  try {
    let statuses = await Status.findAll();
    if (statuses) {
      ctx.status = OK;
      ctx.body = {
        status: OK,
        options: statuses,
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
});

export default router;
