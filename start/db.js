const winston = require("winston");
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  try {
    const db = process.env.DATABASE_STRINGTEST;
    mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
  } catch (e) {
    winston.info(e);
  }
};
