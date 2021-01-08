const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

require("dotenv").config();

const app = express();

const SALT = 10;
const PORT = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: process.env.MYSQL_KEY,
  database: "node_items",
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const INSERT_STATEMENT =
    "INSERT INTO users (username, password) VALUES (?, ?)";
  bcrypt.hash(password, SALT, (err, hash) => {
    if (err) {
      console.log("bcrypt error" + err);
    }
    db.query(INSERT_STATEMENT, [username, hash], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const SELECT_STATEMENT = "SELECT * FROM users WHERE username = ?";

  db.query(SELECT_STATEMENT, [username], (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          req.session.user = result;
          console.log(req.session.user);
          res.send(result);
        } else {
          res.send({ message: "パスワードかユーザーネームが違います" });
        }
      });
    } else {
      res.send({ message: "ユーザーが見つかりません" });
    }
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server ruuning on port ${PORT}`);
});
