import sequelize from "../../config/db.config.js";
import { DataTypes, Model } from "sequelize";

/* const VideoTypes = [
    { key: "hosted", value: "Upload to Server" },
    { key: "youtube", value: "YouTube Video" },
    { key: "vimeo", value: "Vimeo Video" },
]; */

class VideoSource extends Model {}

VideoSource.init(
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "video_source_options",
    timestamps: false,
    sequelize, // We need to pass the connection instance
    modelName: "VideoSource", // We need to choose the model name
  }
);

export default VideoSource;
