const express = require("express");
const app = express();
const connectDB = require("./config/database");
require("./config/database");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require("bcrypt");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age } = req.body;
  try {
    validateSignUpData(req);
    const existingUser = await User.findOne({ emailId: req.body.emailId });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
    });
    if (existingUser) {
      res.status(400).send("User already exists");
    } else {
      await user.save();
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(400).send("Error" + " " + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    validateLoginData(req);
    const user = await User.findOne({ emailId });
    if (!user) {
      res.status(400).send("User not found");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).send("Invalid password");
      } else {
        res.status(200).json(user);
      }
    }
  } catch (error) {
    res.status(400).send("Error" + " " + error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const allowedUpdates = [
      "firstName",
      "lastName",

      "password",
      "age",
      "gender",
    ];
    const isUpdateValid = Object.keys(data).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isUpdateValid) {
      throw new Error("Invalid update");
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(user);
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
