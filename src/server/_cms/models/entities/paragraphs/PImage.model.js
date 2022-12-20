import sequelize from "../../../config/db.config.js";
import { DataTypes, Model } from "sequelize";
import Image from "../media/Image.model.js";

class PImage extends Model {}

PImage.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    /*  url: {
      type: DataTypes.STRING,
      allowNull: false, //inject UUID of image media instead
    }, */
    weight: DataTypes.INTEGER,
  },
  {
    tableName: "paragraph_images",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "Pimage", // We need to choose the model name
  }
);

Image.hasMany(PImage, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "image",
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
PImage.belongsTo(Image, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "image",
    allowNull: false,
  },
});

export default PImage;
