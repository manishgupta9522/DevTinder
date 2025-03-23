const express = require("express");
const app = express();
const auth = require("./middleware/auth");

app.use("/users", auth);

app.get("/users/userId", (req, res) => {
  res.send("Hi Manish!");
});
app.get("/users/getUser", (req, res) => {
  res.send("Hi User!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
