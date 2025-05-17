const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/user_models.js/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Register our users
exports.registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    avatar: { public_id: "url", url: "profile pic url" },
  });

  sendToken(user, 201, res);
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

  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorHandler("user not found", 404));

  // Get reset Password Token

  const token = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  const message = `You requested a password reset.\n\nClick the link to reset: ${resetPasswordURL}\n\nIf you didn’t request this, ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: message,
    });

    res
      .status(200)
      .json({ success: true, message: `email has been send to ${user.email}` });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Reset Password token is is invalid or expired", 400)
    );

  if (req.body.newPassword !== req.body.confirmPasword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = req.body.newPassword;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save({ validateBeforeSave: true });

  sendToken(user, 200, res);
});

// Get USer's details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// Update User's Password
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.comparePassword(req.body.oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPasword) {
    return next(new ErrorHandler(" Password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save({ validateBeforeSave: true });

  sendToken(user, 200, res);
});

// Update User's Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: true });
});

// Get total Users COunt

exports.getUserCount = catchAsyncError(async (req, res, next) => {
  const count = await User.find().countDocuments();

  res.status(200).json({ success: true, count });
});

// Get single User's detail

exports.getSingleUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (user) return next(new ErrorHandler("no such user has been found", 404));

  res.status(200).json({ success: true, user });
});

// Delete A user

exports.deleteAUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next("User not found", 404);

  await User.findByIdAndDelete(req, params.userId);
  res.status(200).json({ success: true });
});

// Chenge Users Role
exports.changeUserRole = catchAsyncError(async (req, res, next) => {
  const userDetails = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findById(req.params.userId);

  if (!user) return next("User not found", 404);

  await User.findByIdAndUpdate(req.params.userId, userDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true });
});
