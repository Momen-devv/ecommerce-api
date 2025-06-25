require("dotenv").config();
const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log("✅ MongoDB connection established successfully.");
};

module.exports = connectionDB;
