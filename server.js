require("dotenv").config();
const morgan = require("morgan");
const connectionDB = require("./db/connect");

const categoryRoute = require("./routes/categoryRoute");

const express = require("express");
const app = express();

// Middlewar
if (process.env.NODE_ENV == "development") app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/categories", categoryRoute);

const PORT = process.env.PORT || 3000;

connectionDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port:${PORT}`);
  });
});
