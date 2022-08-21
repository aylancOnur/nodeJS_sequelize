const express = require("express");
const { Op } = require("sequelize");
const TestModel = require("./models/test-model");

const db = require("./db");

const app = express();
const router = express.Router();

const connectToDB = async () => {
  await db.connect();
  //   await db.createTables();
  console.log("Done");
};

connectToDB();

const createData = async () => {
  //   const test = new TestModel({
  //     testName: "username",
  //     testSurname: "usersurname",
  //   });
  try {
    // const res = await test.save({ logging: true });
    const res = await TestModel.create(
      {
        testName: "username2",
        testSurname: "usersurname2",
      },
      { logging: true }
    );

    console.log("response => ", res);
  } catch (error) {
    console.log("error", error);
  }
};

const findAllData = async () => {
  try {
    const res = await TestModel.findAll({
      attributes: ["id", "testName", "testSurname"],
      logging: true,
    });
    res.forEach((item) => {
      console.log(item.dataValues);
    });
  } catch (error) {
    console.log("error =>", error);
  }
};

const filterData = async () => {
  try {
    const findedData = await TestModel.findAll({
      where: {
        // [Op.or]: [{ testName: "onur" }, { testSurname: "usersurname2" }],
        testName: {
          [Op.ne]: "onur",
        },
      },
    });
    console.log("finded data =>", findedData);
  } catch (error) {
    console.log("error =>", error);
  }
};

const deleteById = async () => {
  try {
    // const findedData = await TestModel.findByPk(3);
    const findedData = await TestModel.findOne({
      where: { test_id: 4 },
    });

    const removedData = await findedData.destroy({
      logging: true,
      force: true,
    });
    console.log("removedData =>", removedData);
  } catch (error) {
    console.log("error =>", error);
  }
};

// createData();
// findAllData();
// filterData();
// deleteById();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);

app.listen(3001, () => {
  console.log("Server is running on port => 3001");
});
