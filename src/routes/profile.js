const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middleware/auth");

profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
