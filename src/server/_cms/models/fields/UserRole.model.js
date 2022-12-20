import sequelize from "../../config/db.config.js";
import { DataTypes, Model } from "sequelize";

/*
Role definations:
    0. inactive role/null
    1. probation
    2. staff (staff and client officers)
    3. manager
    4. executive
    5. dev
*/
/* const roles = [
    { key: 0, value: "inactive role/null" },
    { key: 1, value: "Probation" },
    ...
]; */

class Role extends Model {}

Role.init(
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
    tableName: "roles",
    timestamps: false,
    sequelize, // We need to pass the connection instance
    modelName: "Role", // We need to choose the model name
  }
);

export default Role;
