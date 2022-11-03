"use strict";

const Router = require('@koa/router');
const router = new Router();

const shortenedUrlChecker = require("../middlewares/shorteningService/backHalfChecker");
const { success, error } = require("../utils/response");
const { OK, BAD_REQUEST, NOT_FOUND } = require("../constants/statusCodes");


router.get('/', (ctx, next) => {
	ctx.body = items;
	next();
});


/*
// Check if shortened Url exists, otherwise redirect to service page.
router.use(shortenedUrlChecker, (err, req, res, next) => {
  console.log("process url");
  console.log("error", err);
  if (err) {
    return error({
      code: NOT_FOUND,
      message:
        "The page you are looking for may have moved or no longer exists.",
      res,
    });
  }
  next();
});

router.get("/", (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      message:
        "If you are here, then the back_half url does not exist. API working fine",
    },
  });
});

router.use((req, res) => {
  if (!res.headersSent) {
    return error({
      code: NOT_FOUND,
      message:
        "The page you are looking for may have moved or no longer exists.",
      res,
    });
  }
});
*/
module.exports = router;
