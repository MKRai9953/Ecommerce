const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the user name"],
    maxLenght: [30, "cannot exceed 30 characters"],
    minLength: [4, "Cannot be less than 4 characters"],
    unique: true,
  },
  email: {
    type: String,
    required: ["true", "Please enter the mail"],
    unique: true,
    validation: [validator.isEmail, "Please Enter a valid email"],
  },
  password: {
    type: String,
    required: ["true", "Please enter the password"],
    minLength: [8, "Password cannot be less than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.method("getJWTToken", function () {
  return jwt.sign({ id: this._id }, process.env.JWTSecret, {
    expiresIn: process.env.JWT_Expire,
});
});

userSchema.method("comparePassword", async function (password) {
  return await bcrypt.compare(password, this.password);
});

// Generating user password reset token
userSchema.method("getResetPasswordToken", function () {
  // Generating a token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to user's schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
});

module.exports = mongoose.model("User", userSchema);
