const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: { values: ["accepted", "ignored", "rejected", "intrested"] },
      message: `{VALUE} is not a valid status`,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromId: 1, toId: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function (next) {
  const request = this;
  if (request.isModified("status")) {
    request.updatedAt = new Date();
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
