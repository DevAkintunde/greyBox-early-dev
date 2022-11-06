import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Image from "./Image.model.js";
import Text from "./Text.model.js";
import Video from "./Video.model.js";

class Paragraph extends Model {}

Paragraph.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    tableName: "paragraphs",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Paragraph", // We need to choose the model name
  }
);

Paragraph.hasMany(Image, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent", //the paragraph holder
    allowNull: false,
  },
});
Image.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent",
    allowNull: false,
  },
});

Paragraph.hasMany(Text, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent", //the paragraph holder
    allowNull: false,
  },
});
Text.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent",
    allowNull: false,
  },
});

Paragraph.hasMany(Video, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent", //the paragraph holder
    allowNull: false,
  },
});
Video.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent",
    allowNull: false,
  },
});

export default Paragraph;
