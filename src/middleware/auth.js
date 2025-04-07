const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Token is not valid!!!");
    }
    const decoded = jwt.verify(token, "Manis#090522");
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { authUser };
