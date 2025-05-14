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

const validateEditProfileData = (req) => {
  const editAllowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "profileImage",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    editAllowedFields.includes(key)
  );

  return isEditAllowed;
};

const validateUpdatePassword = (req) => {
  const editAllowedFields = ["oldPassword", "newPassword"];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    editAllowedFields.includes(key)
  );
  if (!isEditAllowed) {
    throw new Error("Request fileds are not allowed to edit");
  }
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new Error("Old password and new password are required");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New password must be strong");
  }
  if (oldPassword === newPassword) {
    throw new Error("New password cannot be the same as the old password");
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateEditProfileData,
  validateUpdatePassword,
};
