const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", authUser, async (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: user.firstName + " sent connection request" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = requestRouter;
