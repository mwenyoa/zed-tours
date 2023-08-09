const AppError = require("./../utilities/Error");

// ============ Handle DB Errors ===========
//[1] cast error
const dbCastErrorHandler = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
// [2] duplicate value errors
const dbDuplicateValuesHandler = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value ${value} try another string name`;
  return new AppError(message, 400);
};
// [3] Validation errors
const dbValidationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  const message = `Validation error. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
// ======== EOF DB Error Handlers ========

// production errors
const sendErrorsInProd = (res, err) => {
  //  check if error is operational
  if (err.isExpected) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // log error for debuging
    console.error("Error Occurred", err);
    // send generic error message
    res.status(500).json({
      status: "error",
      message: "Something went wrong with the system",
    });
  }
};

// development errors
const sendErrorsInDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//Global Error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // send errors based on the environment
  if (process.env.NODE_ENV === "development") {
    sendErrorsInDev(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = dbCastErrorHandler(error);
    if (error.code === 11000) error = dbDuplicateValuesHandler(error);
    if (error.ValidationError) error = dbValidationErrorHandler(error);
    sendErrorsInProd(res, error);
  }
};
