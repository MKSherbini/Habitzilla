require("dotenv").config();

const express = require('express');

const app = express();
const port = process.env.Port;

app.listen(port);


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