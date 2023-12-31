const path = require("path");
const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routes/userRoutes");
const toursRouter = require("./routes/tourRoutes");
const viewRouter = require("./routes/viewRoutes");
const AppError= require("./utilities/AppError");
const AppErrorHandler = require("./controllers/errorsController");

const app = express();
// log user requests stats
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// middlewares
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// mount router
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);
app.use("/", viewRouter);
// capture uncaught errors
app.all("*", (req, res, next) => {
  const err = new AppError(
    `The requested resource url ${req.originalUrl} was not found on our server`, 404
  );
  
  next(err);
});


// Error Handler middleware
app.use(AppErrorHandler);

module.exports = app;
