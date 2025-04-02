const express = require("express");
const app = express();
const connectDB = require("./config/database");
require("./config/database");

const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: req.body.password,
    age: req.body.age,
  });

  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("MongoDb connection established");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("MongoDB not connected", err);
  });
