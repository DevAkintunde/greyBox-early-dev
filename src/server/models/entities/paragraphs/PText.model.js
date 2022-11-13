import sequelize from "../../../config/db.config.js";
import { DataTypes, Model } from "sequelize";

class PText extends Model {}

PText.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    weight: DataTypes.INTEGER,
  },
  {
    tableName: "paragraph_texts",
    timestamps: false,
    //createdAt: "created",
    //updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "PText", // We need to choose the model name
  }
);

export default PText;
