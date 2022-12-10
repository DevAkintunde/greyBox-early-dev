import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Status from "../../fields/EntityStatus.model.js";
import ServiceType from "../../fields/ServiceType.model.js";
import Admin from "../accounts/Admin.model.js";
import Paragraph from "../paragraphs/Paragraph.model.js";
import Image from "../media/Image.model.js";

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
    /* featuredImageUrl: {
      type: DataTypes.STRING,
      field: "featured_image_url",
    }, */
    summary: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.STRING,
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
  onUpdate: "RESTRICT",
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
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
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
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Image.hasMany(Service, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "featuredImage",
    allowNull: true,
  },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Service.belongsTo(Image, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "featuredImage",
    allowNull: true,
  },
});

export default Service;
