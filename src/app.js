const express = require("express");
const app = express();
const connectDB = require("./config/database");
require("./config/database");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middleware/auth");
app.use(express.json());
app.use(cookieParser());

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
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Password is incorrect");
      } else {
        const token = await user.generateAuthToken();
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful" });
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

app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/sendConnectionRequest", authUser, async (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: user.firstName + " sent connection request" });
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
