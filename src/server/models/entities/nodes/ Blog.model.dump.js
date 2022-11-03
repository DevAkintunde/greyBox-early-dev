const sequelize = require("../../../config/db.config");
const { DataTypes, Model, Deferrable } = require("sequelize");
const Status = require("../../fields/dbFields/EntityStatus.model");
const Admin = require("../../entities/accounts/Admin.model");
const Paragraph = require("../paragraphs/Paragraph.model");

class Blog extends Model {}

Blog.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    featuredImagePath: {
      type: DataTypes.STRING,
      field: "featured_image_path",
    },
    summary: {
      type: DataTypes.TEXT,
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
    markForDeletionBy: {
      type: DataTypes.DATE,
      field: "mark_for_deletion_by",
    },
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
    tableName: "blog",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Blog", // We need to choose the model name
  }
);
Admin.hasMany(Blog, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "author",
    allowNull: false,
  },
});
Blog.belongsTo(Admin, {
  targetKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "author",
    allowNull: false,
  },
});
Admin.hasMany(Blog, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "last_revisor", //last revised by
  },
});
Blog.belongsTo(Admin, {
  targetKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "last_revisor", //last revised by
  },
});

Paragraph.hasOne(Blog, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
    //allowNull: false,
  },
});
Blog.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
    //allowNull: false,
  },
});

module.exports = Blog;