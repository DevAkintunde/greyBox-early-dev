import { translatedIncludeProcessor as translatedInclude } from "./translatedIncludeProcessor.js";
import sequelize from "../../config/db.config.js";

// import models
import Page from "../../models/entities/nodes/StaticPage.model.js";
import Admin from "../../models/entities/accounts/Admin.model.js";

import { BAD_REQUEST, OK, SERVER_ERROR } from "../../constants/statusCodes.js";
import { logger } from "../../utils/logger.js";

const queryDbCaller = async (ctx, next) => {
  // Call the database from processored urlQuery
  if (ctx.state.urlQuery && ctx.state.urlQuery.queryCom) {
    const query = ctx.state.urlQuery.queryCom;
    const model = ctx.state.urlQuery.model;
    const querier = ctx.state.urlQuery.dbCaller;

    console.log("here we are semi finally");
    console.log(ctx.state.urlQuery);
    console.log("This Model: ", model);
    console.log("Query keys: ", Object.keys(query));

    if (Object.keys(query).length > 0 && model && model.length > 0) {
      if (query.include) {
        ctx.state.urlQuery.include = query.include;
        delete query.include;
      }
      try {
        const data = await sequelize.transaction(async (t) => {
          let allTransactions = [];
          let transactionIds = [];
          function caller(thisModel) {
            if (querier === "findAll") {
              transactionIds.push(thisModel.toLowerCase());
              allTransactions.push(
                sequelize.models[thisModel].findAll(
                  {
                    ...query,
                  },
                  { transaction: t }
                )
              );
              // use when inplementing include
              /* allTransactions.push(
                sequelize.models[thisModel].findAll(
                  {
                    ...query,
                    include: Admin, //or associated model name include: 'admin',
                    // include: alias name
                  },
                  { transaction: t }
                )
              ); */
              //console.log("thisData:", JSON.stringify(thisData, null, 2));
            } else if (querier === "findOne") {
            } else {
              transactionIds.push(thisModel.toLowerCase());
              allTransactions.push(
                sequelize.models[thisModel].findByPk(
                  ctx.state.urlQuery.filter,
                  {
                    transaction: t,
                  }
                )
              );
            }
          }
          //console.log("transactions:", t);
          // check if model is a group of Array.
          if (Array.isArray(model)) {
            model.forEach((thisModel) => {
              caller(thisModel);
            });
          } else {
            caller(model);
          }
          return await Promise.all(allTransactions).then((returnedData) => {
            let outputData = {};
            for (let i = 0; i < returnedData.length; i++) {
              outputData = {
                [transactionIds[i]]: returnedData[i],
                ...outputData,
              };
            }
            return outputData;
          });
        });
        ctx.state.data = data;
      } catch (err) {
        logger.error('uqlQueryTranslator: ',err);
        ctx.status = BAD_REQUEST;
        ctx.message = "Unable to find entities";
        return;
      }
    }
    //console.log("query data 1: ", JSON.stringify(ctx.state.queryData, null, 2));
    //console.log("query data 2: ", ctx.state.queryData);
    //console.log("query: ", query);
    //console.log("urlQuery", ctx.state.urlQuery);
    /* return success({
      code: OK,
      message: "correct.",
      data: ctx.state.queryData,
      res,
    }); */
  }
  await next();
};
export { queryDbCaller };
