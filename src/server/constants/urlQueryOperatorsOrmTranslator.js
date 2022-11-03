// Query Operators translated to ORM language
// choice ORM is Sequelize.
const { Op } = require("sequelize");

exports.EQUAL_TO = Op.eq;
exports.NOT_EQUAL_TO = Op.ne;
exports.GREATER_THAN = Op.gt;
exports.LESSER_THAN = Op.lt;
exports.GREATER_THAN_EQUAL_TO = Op.gte;
exports.LESS_THAN_EQUAL_TO = Op.lte;
exports.START_WITH = Op.startsWith;
exports.END_WITH = Op.endsWith;
exports.CONTAIN = Op.contains;
exports.IN = Op.in;
exports.NOT_IN = Op.notIn;
exports.BETWEEN = Op.between;
exports.NOT_BETWEEN = Op.notBetween;
exports.IS = Op.is;
exports.NOT = Op.not;
exports.AND = Op.and;
exports.ANY = Op.any;
exports.ALL = Op.all;
exports.OR = Op.or;
exports.VALUES = Op.values;
exports.JOIN = Op.join;
exports.MATCH = Op.match;