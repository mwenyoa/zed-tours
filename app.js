const path = require("path");
const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routes/userRoutes");
const toursRouter = require("./routes/tourRoutes");
const viewRouter = require('./routes/viewRoutes');

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
app.use('/', viewRouter);

module.exports = app;
