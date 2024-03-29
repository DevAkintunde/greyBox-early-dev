import * as operator from "../../constants/urlQueryOperatorsOrmTranslator.js";
import {ModelMapper} from "../../constants/ModelMapper.js";

const sortProcessor = async (ctx, next) => {
  const urlQuery = ctx.state.urlQuery;
  // Construct ORM (sequelize) path for sorting, which is equivalent 'order' in ORM.
  // Model.findAll
  if (urlQuery && urlQuery.sort) {
    let order = [];
    // sort[created[author]=ASC]

    urlQuery.sort.forEach((sorting) => {
      let sortSplit = sorting.split("=");
      let sortTarget;
      let foreignTargetModel;
      let sortTargetHolder = sortSplit[0].split("sort[")[1];
      if (sortTargetHolder.includes("[")) {
        let sortTargetHolderSplit = sortTargetHolder.split("[");
        sortTarget = sortTargetHolderSplit[0];
        foreignTargetModel =
          ModelMapper[sortTargetHolderSplit[1].split("]")[0]];
      } else {
        sortTarget = sortTargetHolder;
      }
      let sortDirection = sortSplit[1].split("]")[0].toUpperCase();
      if (foreignTargetModel) {
        order.push([foreignTargetModel, sortTarget, sortDirection]);
      } else {
        order.push([sortTarget, sortDirection]);
      }
    });
    delete urlQuery.sort;
    urlQuery.queryCom = {
      ...urlQuery.queryCom,
      order: order,
    };
  }
  await next();
};

export { sortProcessor };
