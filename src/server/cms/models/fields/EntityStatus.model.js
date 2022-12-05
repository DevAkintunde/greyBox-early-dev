import sequelize from "../../config/db.config.js";
import { DataTypes, Model } from "sequelize";

/* const statusOptions = [
  { key: "draft", value: "Draft" },
    { key: "in_review", value: "In Review" },
    { key: "published", value: "Published" },
    { key: "unpublished", value: "Unpublished" },
    { key: "deleted", value: "Deleted" },
]; */

class Status extends Model {}

Status.init(
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "entity_statuses",
    timestamps: false,
    sequelize, // We need to pass the connection instance
    modelName: "Status", // We need to choose the model name
  }
);

export default Status;
