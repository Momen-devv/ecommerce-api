const connectionDB = require("./db/connect");
const app = require("./app");

process.on("uncaughtException", (error) => {
  console.log("UNHANDLED EXCEPTION! Shutting down...");
  console.log(error.name, error.message);
  process.exit(1);
});

require("dotenv").config();
const PORT = process.env.PORT || 3000;
let server;

connectionDB().then(() => {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port:${PORT}`);
  });
});

process.on("unhandledRejection", (error) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
