class ErrorHandler extends Error {
  constructor(message = "Internal server Error", statuscode = 500) {
    super(message);
    this.statuscode = statuscode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
