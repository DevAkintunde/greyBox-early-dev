import sequelize from "../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";

/* const stateOptions = [
  { key: "draft", state: "Draft" },
    { key: "in_review", state: "In Review" },
    { key: "published", state: "Published" },
    { key: "unpublished", state: "Unpublished" },
    { key: "deleted", state: "Deleted" },
]; */

class Status extends Model {}

Status.init(
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    state: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "entity_status",
    timestamps: false,
    sequelize, // We need to pass the connection instance
    modelName: "Status", // We need to choose the model name
  }
);

export default Status;
