const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
  .then(function () {
    dbgr("dataBase connected");
  })
  .catch(function (err) {
    console.log("error", err);
    dbgr("can not connect db", err);
  });

module.exports = mongoose.connection;