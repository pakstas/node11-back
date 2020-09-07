const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

const con = mysql.createConnection(process.env.DB_HOST);

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB");
});

con.query("SHOW TABLES like 'cars'", (err, results) => {
  if (err) throw err;
  if (results.length === 0) {
    con.query(
      "CREATE TABLE cars (id INT AUTO_INCREMENT PRIMARY KEY, image TEXT, brand TEXT, model TEXT, price INT)",
      (err, results) => {
        if (err) throw err;
        if (results) {
          console.log(results);
        }
      }
    );
  }
});

app.use(bp.json());
app.use(cors());

app.get("/", (req, res) => {
  con.query("SELECT * FROM cars", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/:brandid", (req, res) => {
  con.query(
    `SELECT * FROM cars WHERE brand = '${req.params.brandid}'`,
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

app.post("/", (req, res) => {
  con.query(
    `INSERT INTO cars (image, brand, model, price) VALUES ('${req.body.image}', '${req.body.brand}', '${req.body.model}', '${req.body.price}')`,
    (err, results) => {
      if (err) throw err;
      console.log(results);
    }
  );
});

app.listen(
  process.env.SERVER_PORT,
  console.log("Server running at port: " + process.env.SERVER_PORT)
);
