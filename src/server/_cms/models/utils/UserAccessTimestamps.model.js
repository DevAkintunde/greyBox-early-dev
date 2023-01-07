import sequelize from "../../config/db.config.js";
import { DataTypes, Model } from "sequelize";
import Admin from "../entities/accounts/Admin.model.js";

class UserAccessTimestamps extends Model {
  toJSON() {
    // remove account_id since it's already on profile as uuid
    let attributes = Object.assign({}, this.get());
    delete attributes["account_id"];
    return attributes;
  }
}

UserAccessTimestamps.init(
  {
    account_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    signedIn: {
      //referenced entity type this OTP is for
      type: DataTypes.DATE,
      field: "last_signed_in",
    },
    signedOut: {
      //referenced primaryKey/ID of content entity this OTP is for
      type: DataTypes.DATE,
      field: "last_signed_out",
    },
    log: {
      //add a comment/log to the model
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "user_access_timestamps",
    timestamps: false,
    sequelize, // We need to pass the connection instance
    modelName: "UserAccessTimestamps", // We need to choose the model name
  }
);

Admin.hasOne(UserAccessTimestamps, {
  sourceKey: "uuid",
  foreignKey: {
    type: DataTypes.UUID,
    name: "account_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserAccessTimestamps.belongsTo(Admin, {
  foreignKey: {
    type: DataTypes.UUID,
    name: "account_id",
    allowNull: false,
  },
});

export default UserAccessTimestamps;
