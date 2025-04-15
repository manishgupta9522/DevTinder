const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id.toString();
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      // console.log(fromUserId, toUserId, status);
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be ignored or intrested" });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromId: fromUserId,
            toId: toUserId,
          },
          {
            fromId: toUserId,
            toId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Request already sent" });
      }

      const request = await ConnectionRequest.create({
        fromId: fromUserId,
        toId: toUserId,
        status: status,
      });
      const data = await request.save();
      res.status(200).json({ message: "Connection request sent" });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const userId = req.user._id;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be accepted or rejected" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toId: userId,
        status: "intrested",
      });

      if (!connectionRequest) {
        return res.status(400).json({ message: "Request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({ message: "Request " + status, data });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

module.exports = requestRouter;
