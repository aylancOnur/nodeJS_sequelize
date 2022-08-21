const express = require("express");
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
        attributes: ['id', 'testName', 'testSurname'],
        logging: true
    });
    res.forEach(item => {
        console.log(item.dataValues);
    })
  } catch (error) {
    console.log("error =>", error);
  }
};

// createData();
findAllData();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);

app.listen(3001, () => {
  console.log("Server is running on port => 3001");
});
