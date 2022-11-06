import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";

class Video extends Model {}

Video.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING, //import key from videoSourceOptions.json
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: DataTypes.INTEGER,
  },
  {
    tableName: "paragraph_videos",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "PVideo", // We need to choose the model name
  }
);

export default Video;
