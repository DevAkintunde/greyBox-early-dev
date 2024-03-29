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
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "text",
    },
    weight: DataTypes.INTEGER,
  },
  {
    tableName: "paragraph_texts",
    timestamps: false,
    //createdAt: "created",
    //updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Ptext", // We need to choose the model name
  }
);

export default PText;
