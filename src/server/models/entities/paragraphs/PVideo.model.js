import sequelize from "../../../config/db.config.js";
import { DataTypes, Model } from "sequelize";
import Video from "../media/Video.model.js";

class PVideo extends Model {}

PVideo.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    /* url: {
      type: DataTypes.STRING,
      allowNull: false, //inject UUID of video media instead
    }, */
    weight: DataTypes.INTEGER,
  },
  {
    tableName: "paragraph_videos",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Pvideo", // We need to choose the model name
  }
);

Video.hasMany(PVideo, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "video",
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
PVideo.belongsTo(Video, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "video",
    allowNull: false,
  },
});

export default PVideo;
