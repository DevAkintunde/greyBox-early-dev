import sequelize from "../../../config/db.config.js";
import { DataTypes, Model } from "sequelize";
import PImage from "./PImage.model.js";
import PText from "./PText.model.js";
import PVideo from "./PVideo.model.js";

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

Paragraph.hasMany(PImage, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent", //the paragraph holder
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PImage.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent",
    allowNull: false,
  },
});

Paragraph.hasMany(PText, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent", //the paragraph holder
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PText.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent",
    allowNull: false,
  },
});

Paragraph.hasMany(PVideo, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent", //the paragraph holder
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PVideo.belongsTo(Paragraph, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "parent",
    allowNull: false,
  },
});

export default Paragraph;
