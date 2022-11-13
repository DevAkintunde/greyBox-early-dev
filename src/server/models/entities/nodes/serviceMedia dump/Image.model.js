import sequelize from "../../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";
import Status from "../../fields/EntityStatus.model.js";
import ServiceType from "../../fields/ServiceType.model.js";

class Image extends Model {}

Image.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "images",
    timestamps: true,
    createdAt: "uploaded",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Image", // We need to choose the model name
  }
);

export default Image;
