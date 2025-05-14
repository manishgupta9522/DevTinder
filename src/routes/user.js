const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { authUser } = require("../middleware/auth");
const User = require("../models/user");
const userRouter = express.Router();
const { validateConnectionRequest } = require("../utils/validation");
USER_POPULATE_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "profileImage",
];
userRouter.get("/user/requests/received", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({
      toId: userId,
      status: "interested",
    }).populate("fromId", USER_POPULATE_FIELDS);
    res.status(200).json({ message: "Requests received", data: requests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({
      $or: [
        { fromId: userId, status: "accepted" },
        { toId: userId, status: "accepted" },
      ],
    })
      .populate("fromId", USER_POPULATE_FIELDS)
      .populate("toId", USER_POPULATE_FIELDS);
    const validRequests = requests.filter((r) => r.fromId && r.toId);
    const data = validRequests.map((request) => {
      if (request.fromId._id.toString() === userId.toString()) {
        return request.toId;
      }
      return request.fromId;
    });

    res.status(200).json({ message: "Accepted requests", data: data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      $or: [{ fromId: userId }, { toId: userId }],
    }).select("fromId toId");
    const hideUsersfromFeed = new Set();
    requests.forEach((request) => {
      hideUsersfromFeed.add(request.fromId._id.toString());
      hideUsersfromFeed.add(request.toId._id.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersfromFeed) } },
        { _id: { $nin: userId } },
      ],
    })
      .select(USER_POPULATE_FIELDS)
      .skip(skip)
      .limit(limit);
    res.status(200).json({ message: "Feed", data: feed });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
