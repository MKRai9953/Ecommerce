const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/user_models.js/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");
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

  const token = user.resetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  const message = `Your Password reset token is :- \n\n ${resetPasswordURL} \n if you have not requested this email, than please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      sucject: "This is an reset passord link send by mayank",
      message: message,
    });

    res
      .status(200)
      .json({ success: true, message: `email has been send to ${user.email}` });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return new ErrorHandler(error.message, 500);
  }
});
