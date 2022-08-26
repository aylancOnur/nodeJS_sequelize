const express = require("express");
const { Op, QueryTypes } = require("sequelize");
const Test = require("./models/test-model");
const User = require("./models/user-model");
const Socials = require("./models/social-model");

User.hasMany(Socials, { foreignKey: "user_id" });

const Actor = require("./models/actor-model");
const Movie = require("./models/movie-model");
const Actor_Movie = require("./models/actor-movie-model");

Actor.belongsToMany(Movie, { through: Actor_Movie, foreignKey: "actor_id" });
Movie.belongsToMany(Actor, { through: Actor_Movie, foreignKey: "movie_id" });

const db = require("./db");

const app = express();
const router = express.Router();

router.get("/getAllData", async (req, res) => {
  try {
    const _res = await Test.findAll({
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
  // const test = new Test({
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
    const _res = await Test.create(
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
    const response = await Test.bulkCreate(data);
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
    // const findedData = await Test.findByPk(3);
    const findedData = await Test.findOne({
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
  const { Test } = req.body;
  try {
    const [data, isCreated] = await Test.findOrCreate({
      where: {
        testName: Test.testName,
      },
      defaults: Test,
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
    const isUpdate = Test.update(
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
    const findedData = await Test.findByPk(itemId);
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
    const response = await Test.findAndCountAll({
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
    const findedData = await Test.findAll({
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
    const response = await Test.create(
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
    // console.log("error =>", error.errors[0].message);
    res.status(500).json({ message: "Bir hata gerçekleşti!" });
  }
});

router.post("/createWithRelational", async (req, res) => {
  // const user = await User.create(
  //   {
  //     username: "Onur",
  //   },
  //   { logging: true }
  // );
  // const user = await User.findByPk(1);
  // const socialMedia = await Socials.findByPk(1);
  // const socialMedia2 = await Socials.findByPk(6);
  // const remove = await user.removeSocial(socialMedia);
  // const removes = await user.removeSocials([socialMedia, socialMedia2]);
  // const x = await user.createSocial({ socialmedia_name: "Facebook" });
  // console.log("x", x);
  // const data = await user.getSocials();
  // console.log("data", data);
  // const count = await user.countSocials();
  // console.log("count", count);
  // const social = await Socials.create({
  //   socialmedia_name: "Instagram",
  // });
  // const social2 = await Socials.create({
  //   socialmedia_name: "Whatsapp",
  // });
  // await user.addSocials([social, social2]);
  // const social = await Socials.create({
  //   socialmedia_name: "Instagram",
  // });
  // const userWithSocial = await user.addSocial(social);
  // console.log("userWithSocial =>", userWithSocial);
});

router.get("/getUserWithSocials", async (req, res) => {
  const data = await User.findAll({
    include: {
      model: Socials,
      attributes: ["socialmedia_name", "id"],
      where: {
        id: {
          [Op.eq]: 4,
        },
      },
    },
  });
  res.json(data);
});

router.post("/manyToManyRelations", async (req, res) => {
  const { actor_name, movie_name } = req.body;
  const actor = await Actor.create({ actor_name });
  const movie = await Movie.create({ movie_name });
  const result = await actor.addMovie(movie);
  res.send(result);
});

router.post("/manyToManyCreateActorWithMovie/:dataId", async (req, res) => {
  const { dataId } = req.params;
  const { movie_name } = req.body;

  const actor = await Actor.findByPk(dataId);

  const result = await actor.createMovie({ movie_name });
  res.status(200).json(result);
});

router.get("/manyToManyGetMovieWithActor/:dataId", async (req, res) => {
  const { dataId } = req.params;
  const actor = await Actor.findByPk(dataId);
  const result = await actor.getMovies();
  res.status(200).json(result);
});

router.delete(
  "/manyToManyRemoveRelation/:dataId/:movieId",
  async (req, res) => {
    const { dataId, movieId } = req.params;
    const actor = await Actor.findByPk(dataId);
    const movie = await Movie.findByPk(movieId);
    const result = actor.removeMovie(movie);
    // await actor.removeMovies([movie1,movie2,...])
    res.status(200).json(result);
  }
);

app.use(express.json());
app.use(router);

app.listen(3001, async () => {
  console.log("Server is running on port => 3001");
  await db.connect();
  // await db.createTables();
  console.log("Done");
});
