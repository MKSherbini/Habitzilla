require("dotenv").config();
const bodyParser = require("body-parser");
const express = require('express');
const mongoose = require("mongoose");

const app = express();
const port = process.env.Port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const userRouter = require("./routes/userRouter");

app.listen(port);

//Connect to DB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch(() => {
    console.log("DB Error.");
  });


app.use("/api/users",userRouter);

app.use((req, res, next) => {
    res.status(269).json({ errorcode: 69, body: "working so stfu" });
});








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