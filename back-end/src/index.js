const express = require("express");
const mongoose = require("mongoose");
const { authenRouter, fitler } = require("./router/authen.js");
const novelRouter = require("./router/novels.js");
const userRouter = require("./router/user.js");
const pluginRouter = require("./router/plugin.js");
const prefsRouter = require("./router/prefs.js");
require("dotenv").config();

const app = express();
const PORT = 8080;

// Phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static('../front-end'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../front-end/index.html');
});

app.listen(PORT, () => console.log("Server started"));
mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log("Novel database connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));