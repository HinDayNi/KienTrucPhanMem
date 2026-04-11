const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://mongo:27017/test");

app.get("/", (req, res) => {
  res.send("Node + Mongo running");
});

app.listen(3000);