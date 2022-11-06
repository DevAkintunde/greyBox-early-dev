import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Status from "../../fields/EntityStatus.model.js";
import Admin from "../accounts/Admin.model.js";
import Paragraph from "../paragraphs/Paragraph.model.js";

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
    featuredImageUrl: {
      type: DataTypes.STRING,
      field: "featured_image_url",
    },
    summary: {
      type: DataTypes.TEXT,
    },
    /* body: {
      type: DataTypes.TEXT,
      allowNull: false,
    }, */
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
    type: DataTypes.UUID,
    name: "author",
    allowNull: false,
  },
});
Page.belongsTo(Admin, {
  targetKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "author",
    allowNull: false,
  },
});

Admin.hasMany(Page, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "last_revisor",
  },
});
Page.belongsTo(Admin, {
  targetKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "last_revisor",
  },
});

Paragraph.hasOne(Page, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
  },
});
Page.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
  },
});

export default Page;
