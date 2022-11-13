import sequelize from "../../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Status from "../../../fields/EntityStatus.model.js";
import VideoSource from "../../../fields/VideoSource.model.js";
import ServiceType from "../../../fields/ServiceType.model.js";

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
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: ServiceType,
        key: "key",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "videos",
    timestamps: true,
    createdAt: "uploaded",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Video", // We need to choose the model name
  }
);

export default Video;
