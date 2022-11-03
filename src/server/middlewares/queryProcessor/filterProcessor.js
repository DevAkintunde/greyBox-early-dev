const operator = require("../../constants/urlQueryOperatorsOrmTranslator");
const { Op } = require("sequelize");

const filterProcessor = async (ctx, next) => {
  {
    /*
  Execute url querys that would have been translated by the middleware utlQueryTranslator
  import translated query from request as

  Values:
    values maybe be quoted in double quotes or not "value". where values contain spaces, it should be quoted "this is the value".
    Multiple values may be separated with comma ',' and this will be automatically treated as an 'or' filter. 
      filter[firstName[START_WITH]=akin,"tunde"]
    However, when using 'or', 'between', 'notBetween', 'in', 'notIn', and 'any' operators, filters should be constructed specifically with ',' inbetween the ranges.
      filter[number[BETWEEN]=4,19]
    
    Optional filters should be preceded with '!' of the operator.
      filter[address.state[!END_WITH]="town"]
*/
  }
  const urlQuery = ctx.state.urlQuery;
  // Construct ORM (sequelize) path for filtering, which is equivalent 'where' in ORM.
  // Model.findAll
  //console.log(urlQuery);
  if (urlQuery && urlQuery.filter && Array.isArray(urlQuery.filter)) {
    let where = {
      //firstName: { [operator["IN"]]: [6, 9] },
    };

    urlQuery.filter.forEach((filtering) => {
      let filterSplit = filtering.split("=");
      let filterTarget;
      let filterCondition = "EQUAL_TO";
      let filterTargetHolder = filterSplit[0].split("filter[")[1];
      if (filterTargetHolder.includes("[")) {
        filterTargetHolderSplit = filterTargetHolder.split("[");
        filterTarget = filterTargetHolderSplit[0];
        filterCondition = filterTargetHolderSplit[1]
          .split("]")[0]
          .toUpperCase();
      } else {
        filterTarget = filterTargetHolder;
      }
      let filterValue = filterSplit[1].split("]")[0];
      // Translate Target, Condition, and Value to ORM equivalent.
      let thisFilterValue;
      const currentFilterValue = filterValue.split(",");
      // convert values to array to allow iteration
      let arrayFilterValues = [];
      currentFilterValue.forEach((thisValue) => {
        let stripValue = thisValue.replace(/"/g, "").trim();
        if (
          (stripValue !== true || stripValue !== null) &&
          !isNaN(stripValue)
        ) {
          //convert stringified number to integer
          arrayFilterValues.push(stripValue * 1);
        } else {
          arrayFilterValues.push(stripValue);
        }
      });
      thisFilterValue = arrayFilterValues;

      // isFilterOr checks if ',' is used inbetween values when not used to declare range.
      let isFilterOr = false;
      // conditionalOr checks if '!' is used before an operator, used to force filter as a 'conditional or' operator.
      let operatorOr = false;
      if (filterCondition.substring(0, 1) === "!") {
        filterCondition = filterCondition.substring(1);
        operatorOr = true;
      }
      if (
        !["BETWEEN", "NOT_BETWEEN", "IN", "NOT_IN", "ANY", "OR"].includes(
          filterCondition
        )
      ) {
        isFilterOr = true;
      }
      if ((isFilterOr && thisFilterValue.length > 1) || operatorOr) {
        let key = operator["OR"];
        let checkKey = where[key];
        // Split values in they are 'OR' arrays. Else import values is range.
        if (isFilterOr) {
          thisFilterValue.forEach((thisValue) => {
            checkKey = where[key];
            if (checkKey) {
              where[key].push({
                [filterTarget]: {
                  [operator[filterCondition]]: thisValue,
                },
              });
            } else {
              where = {
                ...where,
                [key]: [
                  {
                    [filterTarget]: {
                      [operator[filterCondition]]: thisValue,
                    },
                  },
                ],
              };
            }
          });
        } else {
          if (checkKey) {
            where[key].push({
              [filterTarget]: {
                [operator[filterCondition]]: thisFilterValue,
              },
            });
          } else {
            where = {
              ...where,
              [key]: [
                {
                  [filterTarget]: {
                    [operator[filterCondition]]: thisFilterValue,
                  },
                },
              ],
            };
          }
        }
      } else {
        let checkKey = where[filterTarget];
        if (checkKey) {
          let updatedKey = {
            ...where[filterTarget],
            [operator[filterCondition]]: isFilterOr
              ? thisFilterValue[0]
              : thisFilterValue,
          };
          where = {
            ...where,
            [filterTarget]: updatedKey,
          };
        } else {
          where = {
            ...where,
            [filterTarget]: {
              [operator[filterCondition]]: isFilterOr
                ? thisFilterValue[0]
                : thisFilterValue,
            },
          };
        }
      }
    });
    //console.log(where);
    delete urlQuery.filter;
    urlQuery.queryCom = {
      ...urlQuery.queryCom,
      where: where,
    };
  } else if (
    urlQuery &&
    urlQuery.filter &&
    typeof urlQuery.filter === "object"
  ) {
    //console.log("query filter: ", urlQuery.filter);
    urlQuery.queryCom = {
      ...urlQuery.queryCom,
      where: urlQuery.filter,
    };
    delete urlQuery.filter;
  }
  await next();
};

module.exports = filterProcessor;
