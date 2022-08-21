const { DataTypes } = require("sequelize");
const db = require("../db");

const UserModel = db.sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING({ length: 50 }),
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: "UserModel",
    tableName: "user",
    underscored: true,
  }
);

module.exports = UserModel;
