// Query Operators translated to ORM language
// choice ORM is Sequelize.
import { Op } from "sequelize";

export const EQUAL_TO = Op.eq;
export const NOT_EQUAL_TO = Op.ne;
export const GREATER_THAN = Op.gt;
export const LESSER_THAN = Op.lt;
export const GREATER_THAN_EQUAL_TO = Op.gte;
export const LESS_THAN_EQUAL_TO = Op.lte;
export const START_WITH = Op.startsWith;
export const END_WITH = Op.endsWith;
export const CONTAIN = Op.contains;
export const IN = Op.in;
export const NOT_IN = Op.notIn;
export const BETWEEN = Op.between;
export const NOT_BETWEEN = Op.notBetween;
export const IS = Op.is;
export const NOT = Op.not;
export const AND = Op.and;
export const ANY = Op.any;
export const ALL = Op.all;
export const OR = Op.or;
export const VALUES = Op.values;
export const JOIN = Op.join;
export const MATCH = Op.match;
