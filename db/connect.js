require("dotenv").config();
const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connection established successfully.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectionDB;
