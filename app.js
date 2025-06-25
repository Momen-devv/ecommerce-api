require("dotenv").config();
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const categoryRoute = require("./routes/categoryRoute");

const express = require("express");
const app = express();

// Middlewar
if (process.env.NODE_ENV == "development") app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/categories", categoryRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
