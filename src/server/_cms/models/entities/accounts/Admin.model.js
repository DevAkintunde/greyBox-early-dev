import sequelize from "../../../config/db.config.js";
import { DataTypes, Model } from "sequelize";
//const Page = require("./StaticPage.model");

/*
  admin ranks are defined by roles in interger values. 
  1 being the least and rank increases upward. 
  a role of 3 automatically has the privileges of 1, 2 and 3.
  Role definations:
    0. inactive role/null
    1. probation
    2. staff (staff and client officers)
    3. manager
    4. executive
    5. dev
*/

const PROTECTED_ATTRIBUTES = ["password"];
class Admin extends Model {
  toJSON() {
    // hide protected fields
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  }
}

Admin.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    avatar: DataTypes.STRING,
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      field: "last_name",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: "phone_number",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return undefined;
      },
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    state: {
      type: DataTypes.BOOLEAN, //active account should be set to true
      defaultValue: false, //blocked by default
    },
  },
  {
    defaultScope: {
      attributes: {
        /* where: {
          role: 4,
        }, */
        exclude: ["password"],
      },
    },
    scopes: {
      middleware: {
        attributes: {},
      },
    },
    tableName: "admin_accounts",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Admin", // We need to choose the model name
  }
);

// the defined model is the class itself
//console.log(Admin === sequelize.models.Admin); // true

export default Admin;
