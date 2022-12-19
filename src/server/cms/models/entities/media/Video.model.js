import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import VideoSource from "../../fields/VideoSource.model.js";
import Image from "./Image.model.js";

/* const videoTypes = [
  { key: "hosted", value: "Upload to Server" },
  { key: "youtube", value: "YouTube Video" },
  { key: "vimeo", value: "Vimeo Video" },
]; */

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
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: VideoSource,
        key: "key",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    /* thumbnail_url: {
      type: DataTypes.STRING,
    }, */
  },
  {
    tableName: "videos",
    timestamps: true,
    createdAt: "uploaded",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Video", // We need to choose the model name
  }
);

Image.hasMany(Video, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "thumbnailImage",
    allowNull: true,
  },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Video.belongsTo(Image, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "thumbnailImage",
    allowNull: true,
  },
});

export default Video;
