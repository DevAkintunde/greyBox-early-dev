// query caller/processors
import compose from "koa-compose";
// Always remember to map modelToPath each time urlQueryTranslator is added to a new path pattern
import { ModelMapper } from "../constants/ModelMapper.js";
import { filterProcessor } from "./queryProcessor/filterProcessor.js";
import { includeTranslator } from "./queryProcessor/includeTranslator.js";
import { paginationProcessor } from "./queryProcessor/paginationProcessor.js";
import { sortProcessor } from "./queryProcessor/sortProcessor.js";
import { queryDbCaller } from "./queryProcessor/queryDbCaller.js";
import { BAD_REQUEST } from "../constants/statusCodes.js";

// Applicable to GET methods.
const urlQueryTranslator = compose([
  async (ctx, next) => {
    if (
      ctx.isUnauthenticated() &&
      !ctx.originalUrl.includes("state=published")
    ) {
      if (ctx.originalUrl.includes("?")) {
        ctx.originalUrl = ctx.originalUrl + "&filter[state=published]";
      } else {
        ctx.originalUrl = ctx.originalUrl + "?filter[state=published]";
      }
    }
    //check if path is not _cms and is external app integration
    //and divert ModelMapper to the 'app' key instead
    if (ctx.path.includes("/app/")) ModelMapper = ModelMapper.app;
    await next();
  },
  async (ctx, next) => {
    /*
  Only use this middleware to breakdown queries attached to url. 
  Queries should generally be attached behind the '?' notation.
  where the first character of the back_half of the router URL is '?'
      fineAll() querier is used.
      but if there are other alphanumeric character before '?',
      treat as a single fineOne() where 'include' might be important
      and other query tags like filter, sort and pagination are not.
  available query tags include
  1. filtering; as filter
  2. order; or sort as sort
  3. pagination; as page
  4. relationships attachment; as include
structure is contructed as:
  filter: 
    filter[firstName[START_WITH]=akin]&
    filter[address.city[EQUAL_TO]=ajah]
      Whne operator is absent, it is auto-assumed to be EQUAL_TO
      filter operators include:
        EQUAL_TO, NOT_EQUAL_TO, GREATER_THAN, LESSER_THAN, GREATER_THAN_EQUAL_TO, LESS_THAN_EQUAL_TO, START_WITH, END_WITH, CONTAIN, IN, NOT_IN, BETWEEN, NOT_BETWEEN, IS_NULL, IS_NOT_NULL
  sort:
    sort[created=ASC]&sort[date=DESC]
      sort directions include:
        ASC, DESC
    its also possible to sort the field values by a foreign key/entity value.
      sort[created[author]=ASC]
  page:
    page[limit=25]&page[offset=10]
  include:
    include=post.author.rating,tag
    
    Multiple query tags of same type should be join using '&' except for include which should be joined using comma ','. Query of different types shoild always be joined with '&'.
    
  Values:
    values maybe be quoted in double quotes or not "value". where values contain spaces, it should be quoted in "this is the value".
    Multiple values may be separated with comma ',' and this will be automatically treated as an 'or' filter. 
      filter[firstName[START_WITH]=akin,"tunde"]
    However, when using 'or', 'between', 'notBetween', 'in', 'notIn', and 'any' operators, filters should be constructed specifically with ',' inbetween the ranges.
      filter[number[BETWEEN]=4,19]
    
    Optional filters should be preceded with '!' of the operator.
      filter[address.state[!END_WITH]="town"]
*/
    /*
    console.log("originalUrl: ", ctx.originalUrl);
    console.log("path: ", ctx.path);
    console.log("url:", ctx.url);
    console.log('method:', ctx.method.toLowerCase())
*/
    if (ctx.method.toLowerCase() === "get") {
      let query;
      let dbCaller = "findByPk";
      let queryChecker = ctx.originalUrl.split(ctx.path + "?");
      if (queryChecker && queryChecker[1]) {
        query = decodeURI(queryChecker[1]);
      }

      if (query || ctx.params) {
        let queryArray = query ? query.split("&") : null;
        // model is always the last param in path before query
        let model;
        let urlParamsCheck = Object.keys(ctx.params);
        if (urlParamsCheck.length === 0) {
          dbCaller = "findAll";
          let modelFromPathSplit = ctx.path.split("/");
          //console.log("modelFromPathSplit: ", modelFromPathSplit);
          //condition carters for trailing slash that may be in url
          if (modelFromPathSplit[modelFromPathSplit.length - 1]) {
            model =
              ModelMapper[modelFromPathSplit[modelFromPathSplit.length - 1]];
          } else {
            model =
              ModelMapper[modelFromPathSplit[modelFromPathSplit.length - 2]];
          }
        } else {
          let modelFromPathRightTrim = ctx.path.split(
            "/" + ctx.params[urlParamsCheck[0]]
          )[0];
          let modelFromPathLeftSplit = modelFromPathRightTrim.split("/");
          model =
            ModelMapper[
              modelFromPathLeftSplit[modelFromPathLeftSplit.length - 1]
            ];
        }
        //console.log("Model(s) from url: ", model);
        if (!model) {
          ctx.message = "Uri cannot be resolved.";
          ctx.status = BAD_REQUEST;
          return;
        }

        let urlQuery = {};
        let filter = [];
        let sort = [];
        let page;
        let include;

        //Control querier to only include 'include' query tag which makes sense
        // when a single entity is being queried using 'findOne()'.
        queryArray &&
          queryArray.forEach((parameter) => {
            if (dbCaller === "findAll" && parameter.includes("filter")) {
              filter.push(parameter);
            } else if (dbCaller === "findAll" && parameter.includes("sort")) {
              sort.push(parameter);
            } else if (dbCaller === "findAll" && parameter.includes("page")) {
              page = parameter;
            } else if (parameter.includes("include")) {
              include = parameter;
            }
          });
        //set entity ID/UUID to filter if 'findByPk'
        if (dbCaller === "findByPk" && urlParamsCheck.length > 0) {
          filter = ctx.params;
        }
        // model: ORM modelled table
        // queryCom: (queryComponent) contains ORM query syntax to the database
        urlQuery = { model: model, dbCaller: dbCaller, queryCom: {} };
        if (filter && (filter.length > 0 || urlParamsCheck.length > 0)) {
          urlQuery = {
            ...urlQuery,
            filter: filter,
          };
        }
        if (sort && sort.length > 0) {
          urlQuery = {
            ...urlQuery,
            sort: sort,
          };
        }
        if (page && page.length > 0) {
          urlQuery = {
            ...urlQuery,
            page: page,
          };
        }
        if (include && include.length > 0) {
          urlQuery = {
            ...urlQuery,
            include: include,
          };
        }
        console.log("query: ", urlQuery);
        ctx.state.urlQuery = urlQuery;
      }
    }
    await next();
  },
  filterProcessor,
  sortProcessor,
  paginationProcessor,
  includeTranslator,
  queryDbCaller,
]);
export { urlQueryTranslator };
