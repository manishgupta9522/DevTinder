const express = require("express");
const app = express();

app.get("/users/:userId", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send("Hi!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
