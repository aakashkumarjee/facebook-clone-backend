const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const PORT = 8080;
//mongo connection
const cors = require("cors");
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongoose happy coding");
});
mongoose.connection.on("error", (err) => {
  console.log("Connection to mongoose falide error: ", err);
});
require("./models/user");
require("./models/post");
//middleware
const customMiddleware = (req, res, next) => {
  console.log("middleware executed");
  next();
};
const manualMiddleware = (req, res, next) => {
  console.log("Manual middleware executed");
  next();
};
app.use(cors());
app.use(express.json());
app.use(require("./router/auth"));
app.use(require("./router/post"));
app.use(customMiddleware);
//router
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/about", manualMiddleware, (req, res) => {
  res.send("You got to about page");
});

app.listen(PORT, () => {
  console.log("Server Started at port", PORT);
});
