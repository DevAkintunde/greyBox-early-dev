import sequelize from "../../_cms/config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Admin from "../../_cms/models/entities/accounts/Admin.model.js";
import Paragraph from "../../_cms/models/entities/paragraphs/Paragraph.model.js";
import ServiceType from "./fields/ServiceType.model.js";
import Status from "../../_cms/models/fields/EntityStatus.model.js";

class Service extends Model {}

Service.init(
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
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    autoAlias: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "auto_alias",
    },
    summary: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: ServiceType,
        key: "key",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
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
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "featured_image",
    },
    featuredImageStyles: {
      type: DataTypes.JSON,
      field: "featured_image_styles",
    },
  },
  {
    defaultScope: {
      attributes: {},
    },
    scopes: {
      middleware: {
        attributes: {},
      },
      bin: {
        attributes: {},
      },
    },
    tableName: "services",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    paranoid: true,
    deletedAt: "deleted",
    sequelize, // We need to pass the connection instance
    modelName: "Service", // We need to choose the model name
  }
);

Admin.hasMany(Service, {
  foreignKey: {
    type: DataTypes.STRING,
    name: "author",
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Service.belongsTo(Admin, {
  targetKey: "email",
  foreignKey: {
    type: DataTypes.STRING,
    name: "author",
    allowNull: false,
  },
});

Admin.hasMany(Service, {
  foreignKey: {
    type: DataTypes.STRING,
    name: "last_revisor",
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Service.belongsTo(Admin, {
  targetKey: "email",
  foreignKey: {
    type: DataTypes.STRING,
    name: "last_revisor",
  },
});

Paragraph.hasOne(Service, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
    allowNull: true,
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Service.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
    allowNull: true,
  },
});

export default Service;
