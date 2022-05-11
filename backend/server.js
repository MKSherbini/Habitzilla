require("dotenv").config();
const bodyParser = require("body-parser");
const express = require('express');
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerAutogen = require('./swagger-generator');

const app = express();
const port = process.env.Port;
require('./routes')(app);

app.listen(port);

//Connect to DB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB Connected");
    swaggerAutogen().then(() => assigneAppMWs());
  })
  .catch(() => {
    console.log("DB Error.");
  });



function assigneAppMWs() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  //Not found MW
  app.use((request, response) => {
    response.status(404).json({ data: "Not Found" });
  });

  //Error MW
  app.use((error, request, response, next) => {
    //JS  code function.length
    let status = error.status || 500;
    response.status(status).json({ Error: error + "" });
  });
}