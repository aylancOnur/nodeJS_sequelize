const express = require("express");
const db = require("./db");

const app = express();
const router = express.Router();

const connectToDB = async () => {
    await db.connect();
    await db.createTables();
    console.log('Done');
}

connectToDB();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);

app.listen(3001, () => {
  console.log("Server is running on port => 3001");
});
