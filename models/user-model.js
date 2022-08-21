const { DataTypes } = require("sequelize");
const db = require("../db");

const User= db.sequelize.define(
  "User",
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
    modelName: "User",
    tableName: "user",
    underscored: true,
  }
);

module.exports = User;
