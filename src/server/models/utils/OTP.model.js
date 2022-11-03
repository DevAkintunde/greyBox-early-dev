const sequelize = require("../../config/db.config");
const { DataTypes, Model } = require("sequelize");

// Structure
// GET: /verify?filter[id=akin@thin.city]&filter[code=gjU866bi35h]
class OTP extends Model {}

OTP.init(
  {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    ref: {
      //referenced entity type this OTP is for
      type: DataTypes.STRING,
      allowNull: false,
      field: "ref_entity",
    },
    id: {
      //referenced primaryKey/ID of content entity this OTP is for
      type: DataTypes.STRING,
      allowNull: false,
      field: "ref_id",
    },
    log: {
      //add a comment/log to the model
      type: DataTypes.TEXT,
    },
    markForDeletionBy: {
      type: DataTypes.DATE,
      field: "mark_for_deletion_by",
    },
  },
  {
    tableName: "otp_reservation",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
    sequelize, // We need to pass the connection instance
    modelName: "OTP", // We need to choose the model name
  }
);

module.exports = OTP;
