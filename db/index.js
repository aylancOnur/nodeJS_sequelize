const { Sequelize, DataTypes } = require("sequelize");

const db = {};

const sequelize = new Sequelize("sequelizedb", "root", "Your DB Password", {
  host: "localhost",
  dialect: "mysql",
  pool: 40,
  logging: true,
  retry: 3,
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.connect = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.authenticate({ logging: true });
      console.log("Bağlantı başarıyla gerçekleşti.");
      resolve(db);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

db.createTables = async () => {
  const TestModel = require("../models/test-model");
  const UserModel = require("../models/user-model");
  const SocialModel = require("../models/social-model");
  UserModel.hasMany(SocialModel);
  SocialModel.belongsTo(UserModel);
  // await TestModel.sync({ force: true });
  sequelize.sync({ force: true });
};

module.exports = db;
