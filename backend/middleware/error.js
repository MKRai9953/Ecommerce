const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode ?? 500;
  err.message = err.message ?? "Internal server error";

  // Handling mongodberror
  if ("CastError" === err.name) {
    const message = `resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Duplicate Error
  if (err.code === 1100) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Token
  if (err.name === "JsonWebTokenError") {
    const message = `JsonWebToken is invalid try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expire Error
  if (err.name === "TokenExpire Erro") {
    const message = `JsonWebToken is Error try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statuscode).json({ success: false, error: err.stack });
};
