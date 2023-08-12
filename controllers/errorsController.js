const AppError = require("../utilities/AppError");

// ============ Handle DB Errors ===========
//[1] cast error
const dbCastErrorHandler = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
// [2] duplicate value errors
const dbDuplicateValuesHandler = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value} try another string name`;
  return new AppError(message, 400);
};
// [3] Validation errors
const dbValidationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  const message = `Validation error. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// =============== THIRD PARTY ERRORS =====================
const jwtErrorHandler = () =>
  new AppError("Invalid Token, Please Log In Again", 401);

const jwtExpiredTokenHandler = () =>
  new AppError("Token has expired, login again", 401);
// =============== EOF THIRD PARTY ERRORS =================

// production errors
const sendErrorsInProd = (err, res) => {
  //  check if error is operational
  if (err.isErrorExpected) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
   
    res.status(500).json({
      status: "error",
      message: "Something went wrong with the system",
    });
  }
};

// development errors
const sendErrorsInDev = (err, res) => {
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
    sendErrorsInDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = dbCastErrorHandler(error);
    if (error.code === 11000) error = dbDuplicateValuesHandler(error);
    if (error.ValidationError) error = dbValidationErrorHandler(error);
    if (error.name === "JsonWebTokenError") error = jwtErrorHandler();
    if (error.name === "TokenExpiredError") error = jwtExpiredTokenHandler();
    sendErrorsInProd(error, res);
  }
};
