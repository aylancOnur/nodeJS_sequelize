const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config()

const db = {};
const sequelize = new Sequelize(
  "sequelizedb",
  "root",
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    pool: 40,
    logging: true,
    retry: 3,
  }
);

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
  // const Test = require("../models/test-model");
  const User = require("../models/user-model");
  const Socials = require("../models/social-model");
  User.hasMany(Socials, { foreignKey: "user_id" });
  Socials.belongsTo(User);
  // await TestModel.sync({ force: true });
  sequelize.sync({ force: true });
};

module.exports = db;
