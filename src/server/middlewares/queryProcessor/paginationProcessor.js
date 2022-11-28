import * as operator from "../../constants/urlQueryOperatorsOrmTranslator.js";
import { Op } from "sequelize";

const paginationProcessor = async (ctx, next) => {
  const urlQuery = ctx.state.urlQuery;
  // Construct ORM (sequelize) path.
  // Model.findAll
  // When limit or the entire page[query] is ommited in query, default limit is used.
  // offset is an optional optional

  if (urlQuery && urlQuery.page) {
    let page = {
      limit: urlQuery.querier === "findAll" ? 20 : 0, //default & optional
    };
    // page[limit=10,offset=10]

    let pagerSuffix = urlQuery.page.split("page[")[1];
    let pager = pagerSuffix.split("]")[0];

    if (pager.includes(",")) {
      let pagerAttributes = pager.split(",");
      pagerAttributes.forEach((attr) => {
        if (attr.includes("limit")) {
          if (!isNaN(attr.split("=")[1] * 1)) {
            page.limit = attr.split("=")[1] * 1;
          }
        } else if (attr.includes("offset")) {
          if (!isNaN(attr.split("=")[1] * 1)) {
            page = {
              ...page,
              offset: attr.split("=")[1] * 1,
            };
          }
        }
      });
    } else {
      if (pager.includes("limit")) {
        if (!isNaN(pager.split("=")[1] * 1)) {
          page.limit = pager.split("=")[1] * 1;
        }
      } else if (pager.includes("offset")) {
        if (!isNaN(pager.split("=")[1] * 1)) {
          page = {
            ...page,
            offset: pager.split("=")[1] * 1,
          };
        }
      }
    }
    if (page.limit) {
      if (page.limit === 1 && !page.offset && urlQuery.dbCaller === "findAll") {
        urlQuery.dbCaller = "findOne";
      }
      urlQuery.queryCom = {
        ...urlQuery.queryCom,
        ...page,
      };
    }
    delete urlQuery.page;
  }
  await next();
};

export { paginationProcessor };
