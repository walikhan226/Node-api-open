const winston = require("winston");
const express = require("express");

const app = express();

//require("./startup/logging")();
require("./start/cors")(app);
require("./start/route")(app);
require("./start/db")();
require("./start/prod")(app);



require("./start/validation")();

const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
