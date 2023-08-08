class appException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    // classify error
      this.isExpected = true;
    // create the stacktrace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = appException;

