const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (
    firstName.length < 4 ||
    firstName.length > 50 ||
    lastName.length < 4 ||
    lastName.length > 50
  ) {
    throw new Error(
      "First name and last name must be between 4 and 50 characters"
    );
  } else if (!emailId) {
    throw new Error("Email is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!password) {
    throw new Error("Password is required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    throw new Error("Email and password are required");
  }
};

module.exports = { validateSignUpData, validateLoginData };
