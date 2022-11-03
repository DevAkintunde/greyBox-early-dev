const sequelize = require("../../config/db.config");
const { DataTypes, Model } = require("sequelize");

const PROTECTED_ATTRIBUTES = ["password", "markForDeletionBy"];
class User extends Model {
  toJSON() {
    // hide protected fields
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  }
}

User.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    suspension: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    markForDeletionBy: {
      type: DataTypes.DATE,
      field: "mark_for_deletion_by",
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["password","markForDeletionBy"],
      },
    },
    scopes: {
      admin: {
        attributes: {
          exclude: ["password"],
        },
      },
      middleware: {
        attributes: {},
      },
    },
    tableName: "user_accounts",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);

// the defined model is the class itself
//console.log(Customer === sequelize.models.Customer); // true

module.exports = User;
