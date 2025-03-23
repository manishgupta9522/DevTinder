const auth = (req, res, next) => {
  const token = "xyz";
  const isAutorized = token === "xyz";
  if (!isAutorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = auth;
