const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }); // Return to stop further execution
    }

    const decoded = jwt.verify(token, "Manis#090522");
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" }); // Return to stop further execution
    } else {
      req.user = user;
      return next(); // Ensure next() is only called if no response is sent
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" }); // Return here as well
  }
};

module.exports = { authUser };
