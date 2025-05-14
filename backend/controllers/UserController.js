const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/user_models.js/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
// Register our users

exports.registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    avatar: { public_id: "url", url: "profile pic url" },
  });
  const token = user.getJWTToken();
  res.status(201).json({ success: true, user: user, token });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter User's Email or Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password"), 400);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password"), 400);
  }

  const token = user.getJWTToken();
  res.status(200).json({ success: true, user: user, token });
});
