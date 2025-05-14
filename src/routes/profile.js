const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middleware/auth");
const {
  validateEditProfileData,
  validateUpdatePassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Request fileds are not allowed to edit");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.send("profile updated successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/updatePassword", authUser, async (req, res) => {
  try {
    validateUpdatePassword(req);
    const user = req.user;
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res.send("password updated successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
