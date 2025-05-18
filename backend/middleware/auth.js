const User = require("../models/user_models.js/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncError(async (req, _, next) => {
  const { token } = req.cookies;

  if (!token)
    return next(new ErrorHandler("Please login to access this resource", 401));
  
  const decodedData = jwt.verify(token, process.env.JWTSecret);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("you are not authorized to do that", 403));
    }
    next();
  };
};
