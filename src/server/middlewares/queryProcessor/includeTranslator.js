import * as operator from "../../constants/urlQueryOperatorsOrmTranslator.js";
import { Op } from "sequelize";

const includeTranslator = async (ctx, next) => {
  {
    /* hello */
  }
  const urlQuery = ctx.state.urlQuery;
  // Construct ORM (sequelize) path.
  // Model.findAll
  if (urlQuery && urlQuery.include) {
    let include = {
      //firstName: { [operator["IN"]]: [6, 9] },
    };
    // include=author.rating,tag
    let includedSplit = urlQuery.include.split("=")[1];
    let includedEntities = {};
    let includedGroup = includedSplit.split(",");

    includedGroup.forEach((entity) => {
      let validEntity = entity.trim();
      if (validEntity) {
        let thisComboEntities = [];
        splitEntity = validEntity.split(".");

        for (let i = 0; i < splitEntity.length; i++) {
          if (i < 1) {
            thisComboEntities.push(splitEntity[i]);
          } else {
            thisComboEntities.push(
              thisComboEntities[i - 1] + "." + splitEntity[i]
            );
          }
        }
        let comboKey = thisComboEntities[0];
        includedEntities = {
          ...includedEntities,
          [comboKey]: [...thisComboEntities],
        };
        //console.log( includedEntities)
      }
    });
    // always check if field is multi-valued in db; that is if array.
    /*
    includedEntities = {
        author: [author, author.rating, author.rating.extra], 
        tag: [tag]
    }
    */
    delete urlQuery.include;
    urlQuery.queryCom = {
      ...urlQuery.queryCom,
      include: includedEntities,
    };
  }
  await next();
};

export { includeTranslator };
