"use strict";
// api endpoints documentations
// all APIs navigators
const koaBody = require("koa-body");
const Router = require("@koa/router");
const router = new Router({
  prefix: "/api/dev",
});
const { verify: verifyToken } = require("../utils/token");
const { OK, UNAUTHORIZED } = require("../constants/statusCodes");

// middleware that is specific to this router
router.use((req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  const { email, role } = verifyToken(token);
  if (!email || !role || role < 5) {
    return error({
      code: UNAUTHORIZED,
      message: "Please sign in as a privileged dev for elevated access.",
      res,
    });
  }
  const APIs = {
    purview: {
      page: {
        route: "/page",
        paths: {
          GET: "/",
          "GET/POST": "/create",
          GET: "/:uuid",
          "GET/PATCH": "/:uuid/edit",
          DELETE: "/:uuid/delete",
          PATCH: "/:uuid/edit/alias",
          PATCH: "/:uuid/edit/state",
        },
      },
    },
    account: { page: { route: "/account", paths: {} } },
  };
  return success({
    code: OK,
    data: APIs,
    res,
  });
});

module.exports = router;
