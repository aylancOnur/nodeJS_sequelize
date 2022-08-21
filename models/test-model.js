const { DataTypes } = require("sequelize");
const db = require("../db");

const TestModel = db.sequelize.define(
  "test",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      field: "test_id",
    },
    testName: {
      type: DataTypes.STRING({ length: 50 }),
    //   defaultValue: "defaultValue",
    },
    testSurname: {
      type: DataTypes.CHAR({ length: 50 }),
    //   defaultValue: "defaultValue",
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: "TestModel",
    tableName: "test"
  }
);

module.exports = TestModel;
