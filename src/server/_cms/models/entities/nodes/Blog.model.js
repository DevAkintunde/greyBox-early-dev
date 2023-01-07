import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Status from "../../fields/EntityStatus.model.js";
import Admin from "../accounts/Admin.model.js";
import Paragraph from "../paragraphs/Paragraph.model.js";
import Image from "../media/Image.model.js";

class Blog extends Model {}

Blog.init(
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
    /* body: {
      type: DataTypes.TEXT,
      allowNull: false,
    }, */
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
    tableName: "blog",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    paranoid: true,
    deletedAt: "deleted",
    sequelize, // We need to pass the connection instance
    modelName: "Blog", // We need to choose the model name
  }
);

Admin.hasMany(Blog, {
  foreignKey: {
    type: DataTypes.STRING,
    name: "author",
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Blog.belongsTo(Admin, {
  targetKey: "email",
  foreignKey: {
    type: DataTypes.STRING,
    name: "author",
    allowNull: false,
  },
});

Admin.hasMany(Blog, {
  foreignKey: {
    type: DataTypes.STRING,
    name: "last_revisor",
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Blog.belongsTo(Admin, {
  targetKey: "email",
  foreignKey: {
    type: DataTypes.STRING,
    name: "last_revisor",
  },
});

Paragraph.hasOne(Blog, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
    allowNull: true,
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Blog.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "body",
    allowNull: true,
  },
});

Image.hasMany(Blog, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "featuredImage",
    allowNull: true,
  },
  onDelete: "RESTRICT",
  onUpdate: "SET NULL",
});
Blog.belongsTo(Image, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "featuredImage",
    allowNull: true,
  },
});

export default Blog;
