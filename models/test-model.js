const { DataTypes } = require("sequelize");
const db = require("../db");

const Test = db.sequelize.define(
  "Test",
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
      get() {
        const val = this.getDataValue("testName");
        console.log("getter is working!");
        return val.toUpperCase() + "-Getter";
      },
      set(value) {
        console.log("setter is working!");
        this.setDataValue("testName", value.toUpperCase());
      },
      testFullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.testName + "-" + this.testSurname;
        },
      },
      //   defaultValue: "defaultValue",
    },
    testSurname: {
      type: DataTypes.CHAR({ length: 50 }),
      validate: {
        customValidate(value) {
          if (value === "admin") {
            throw new Error("Admin değeri girilemez!");
          }
        },
      },
      //   defaultValue: "defaultValue",
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: "Test",
    tableName: "test",
    hooks: {
      beforeValidate: (model) => {
        console.log("BeforeValidate =>", model);
      },
    },
  }
);

Test.addHook("afterCreate", (m) => {
  // git mail at şu tabloya başka bir kayıt ekle
  console.log("after create =>", m);
});

module.exports = Test;
