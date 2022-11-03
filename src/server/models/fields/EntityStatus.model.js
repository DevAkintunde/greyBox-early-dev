const sequelize = require('../../config/db.config');
const { DataTypes, Model } = require("sequelize");

class Status extends Model {}

Status.init({
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  state: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'entity_status',
  timestamps: false,
  sequelize, // We need to pass the connection instance
  modelName: 'Status' // We need to choose the model name
});

module.exports = Status;