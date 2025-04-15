const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;
module.exports = authRouter;
