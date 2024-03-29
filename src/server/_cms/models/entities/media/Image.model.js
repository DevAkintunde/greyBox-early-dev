import sequelize from "../../../config/db.config.js";
import { DataTypes, Model } from "sequelize";

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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    styles: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "images",
    timestamps: true,
    createdAt: "uploaded",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Image", // We need to choose the model name
  }
);

export default Image;
