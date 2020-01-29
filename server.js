const express = require("express");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("database.json");
const database = lowdb(adapter);
const app = express();
const port = process.env.PORT || 8000;

//app.use(express.static("public"));

//Database defaults-----------------------------------------------
const initiateDatabase = () => {
  const items = database.has("products").value();
  const shoppingCart = database.has("cart").value();

  if (!items) {
    database.defaults({ products: [], cart: [] }).write();
  }

  if (!shoppingCart) {
    database.defaults({ products: [], cart: [] }).write();
  }
};

app.listen(port, () => {
  console.log("Server started on port: ", port);
  initiateDatabase();
});

module.exports = app;
