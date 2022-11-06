import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";

class Image extends Model {}

Image.init(
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: DataTypes.INTEGER,
  },
  {
    tableName: "paragraph_images",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "PImage", // We need to choose the model name
  }
);

export default Image;
