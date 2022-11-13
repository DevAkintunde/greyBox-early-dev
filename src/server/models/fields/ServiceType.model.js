import sequelize from "../../config/db.config.js";
import { DataTypes, Model, Deferrable } from "sequelize";

/* let ServiceTypes = [
  {
    key: "cinematography_lighting",
    value: "Cinematography & Lighting",
  },
  {
    key: "graphics",
    value: "Graphics",
  },
  {
    key: "live_stream",
    value: "Live Stream",
  },
  {
    key: "motion_graphics",
    value: "Motion Graphics",
  },
  {
    key: "photography",
    value: "Photography",
  },
  {
    key: "story_development",
    value: "Story Development",
  },
  {
    key: "videography",
    value: "Videography",
  },
  {
    key: "web_design",
    value: "Web Design",
  },
]; */

class ServiceType extends Model {}

ServiceType.init(
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
    tableName: "service_types",
    timestamps: false,
    sequelize, // We need to pass the connection instance
    modelName: "ServiceType", // We need to choose the model name
  }
);

export default ServiceType;
