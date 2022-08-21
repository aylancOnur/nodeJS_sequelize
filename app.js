const express = require("express");
const { Op, QueryTypes } = require("sequelize");
const TestModel = require("./models/test-model");

const db = require("./db");

const app = express();
const router = express.Router();

router.get("/getAllData", async (req, res) => {
  try {
    const _res = await TestModel.findAll({
      attributes: ["id", "testName", "testSurname"],
      logging: true,
    });
    res.json(_res);
  } catch (error) {
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
    console.log("error =>", error);
  }
});

router.post("/createData", async (req, res) => {
  // const test = new TestModel({
  //   testName: "username",
  //   testSurname: "admin",
  // });
  // test
  //   .validate()
  //   .then((_val) => {
  //     console.log("_val", _val);
  //   })
  //   .catch((err) => {
  //     console.log("err =>", err.errors[0].message);
  //   });
  // return;
  const { testName, testSurname } = req.body;
  try {
    const _res = await TestModel.create(
      {
        testName,
        testSurname,
      },
      { logging: true, validate: true }
    );
    res.status(201).json(_res);
  } catch (error) {
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
    console.log("error =>", error.errors[0].message);
  }
});

router.post("/createMultiple", async (req, res) => {
  const { data } = req.body;
  try {
    const response = await TestModel.bulkCreate(data);
    res.status(200).json(response);

    console.log("removedData =>", response);
  } catch (error) {
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
    console.log("error =>", error);
  }
});

router.delete("/delete/:itemId", async (req, res) => {
  console.log(req.params);
  const { itemId } = req.params;
  try {
    // const findedData = await TestModel.findByPk(3);
    const findedData = await TestModel.findOne({
      where: { test_id: itemId },
    });

    const removedData = await findedData.destroy({
      logging: true,
      force: true,
    });
    res.status(200).json(removedData);
    console.log("removedData =>", removedData);
  } catch (error) {
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
    console.log("error =>", error);
  }
});

router.post("/findOrCreate", async (req, res) => {
  const { testModel } = req.body;
  try {
    const [data, isCreated] = await TestModel.findOrCreate({
      where: {
        testName: testModel.testName,
      },
      defaults: testModel,
    });

    if (isCreated) {
      res.status(200).json({ isExist: false, ...data });
      return;
    }
    res.status(200).json({ isExist: true, ...data });
  } catch (error) {
    console.log("error =>", error);
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
  }
});

router.put("/updateData/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { testName, testSurname } = req.body;
  try {
    const isUpdate = TestModel.update(
      { testName, testSurname },
      { where: { test_id: itemId } }
    );
    res.status(200).json(isUpdate);
  } catch (error) {
    console.log("error =>", error);
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
  }
});

router.get("/getDataById/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const findedData = await TestModel.findByPk(itemId);
    res.json(findedData);
  } catch (error) {
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
    console.log("error =>", error);
  }
});

router.get("/getDataWithPagination", async (req, res) => {
  const { limit, offset } = req.query;
  console.log("req query =>", limit, offset);
  try {
    const response = await TestModel.findAndCountAll({
      limit: Number(limit),
      logging: true,
      offset: Number(offset),
    });
    res.status(200).json(response);
  } catch (err) {
    console.log("error =>", err);
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
  }
});

router.get("/getDataByQuery/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const response = await db.sequelize.query(
    "SELECT * FROM test WHERE test_id = :testId",
    {
      replacements: {
        testId: itemId,
      },
      logging: console.log,
      type: QueryTypes.SELECT,
    }
  );
  res.status(200).json(response);
});

router.get("/filterData", async (req, res) => {
  try {
    const findedData = await TestModel.findAll({
      where: {
        // [Op.or]: [{ testName: "onur" }, { testSurname: "usersurname2" }],
        testName: {
          [Op.ne]: "onur",
        },
      },
    });
    res.status(200).json(findedData);
  } catch (error) {
    console.log("error =>", error);
  }
});

router.post("/createDataWithTransaction", async (req, res) => {
  const { testName, testSurname } = req.body;
  const t = await db.sequelize.transaction();
  try {
    const response = await TestModel.create(
      {
        testName,
        testSurname,
      },
      { logging: true, validate: true }
    );
    await t.commit();
    console.log("res =>", response.testFullName);
    res.status(200).json(response);
  } catch (error) {
    await t.rollback();
    console.log("error =>", error.errors[0].message);
    res.status(500).json({ message: "Bir hata gerçekleşti!"});
  }
});

app.use(express.json());
app.use(router);

app.listen(3001, async () => {
  console.log("Server is running on port => 3001");
  await db.connect();
  // await db.createTables();
  console.log("Done");
});
