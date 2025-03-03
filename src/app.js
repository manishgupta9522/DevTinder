const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World people!");
});

app.get("/hello", (req, res) => {
  res.send("Hi!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
