const { DataTypes } = require("sequelize");
const db = require("../db");

const Socials = db.sequelize.define(
  "Socials",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    socialmedia_name: {
      type: DataTypes.STRING({ length: 50 }),
    }
  },
  {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: "Socials",
    tableName: "social",
    underscored: true,
  }
);

module.exports = Socials;
