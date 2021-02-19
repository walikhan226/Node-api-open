const winston = require('winston');
const mongoose = require('mongoose');


module.exports = function() {
  const db = "mongodb://localhost/abc123";
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`));
}