const express = require("express");
const mysql = require("mysql2");

const app = express();

const db = mysql.createConnection({
  host: "mysql",
  user: "user",
  password: "password",
  database: "mydb"
});

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
  }
});

app.get("/", (req, res) => {
  res.send("Node + MySQL running");
});

app.listen(3000);