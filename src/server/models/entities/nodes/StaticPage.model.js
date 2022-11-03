const sequelize = require("../../../config/db.config");
const { DataTypes, Model, Deferrable } = require("sequelize");
const Status = require("../../fields/EntityStatus.model");
const Admin = require("../accounts/Admin.model");

class Page extends Model {}

Page.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    featuredImageUri: {
      type: DataTypes.STRING,
      field: "featured_image_uri",
    },
    summary: {
      type: DataTypes.TEXT,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: "draft",
      references: {
        model: Status,
        key: "key",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    revisionNote: {
      type: DataTypes.TEXT,
      field: "revision_note",
    },
    /* author: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Admin,
        key: "email",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    }, */
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["markForDeletionBy"],
      },
    },
    scopes: {
      middleware: {
        attributes: {},
      },
      bin: {
        attributes: {},
      },
    },
    tableName: "static_pages",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Page", // We need to choose the model name
  }
);
Admin.hasMany(Page, {
  foreignKey: {
    type: DataTypes.STRING,
    name: "author",
    allowNull: false,
  },
});
Page.belongsTo(Admin, {
  as: "author",
  as: "revision_by",
  targetKey: "email",
  foreignKey: {
    type: DataTypes.STRING,
    name: "author",
    allowNull: false,
  },
});

module.exports = Page;
