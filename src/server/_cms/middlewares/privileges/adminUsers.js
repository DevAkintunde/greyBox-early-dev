import { koaBody } from "koa-body";
import { UNAUTHORIZED } from "../../constants/statusCodes.js";

const accountsManagement = async (ctx, next) => {
  if (ctx.method.toLowerCase() !== "get" && ctx.state.user.role < 4) {
    ctx.status = UNAUTHORIZED;
    ctx.message = "Admin user does not have the required permission.";
    return;
  } else if (
    ctx.method.toLowerCase() === "post" ||
    ctx.method.toLowerCase() === "patch"
  ) {
    const requestBody = () => {
      return koaBody({ multipart: true })(ctx, next);
    };
    await requestBody();
  } else {
    await next();
  }
};

export { accountsManagement };
