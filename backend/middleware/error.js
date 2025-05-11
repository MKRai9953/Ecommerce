const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode ?? 500;
  err.message = err.message ?? "Internal server error";

  // Handling mongodberror
  if ("CastError" === err.name) {
    const message = `resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statuscode).json({ success: false, error: err.stack });
};
