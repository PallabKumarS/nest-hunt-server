import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { Server } from "http";

let server: Server;

async function main() {
  try {
    // connect to database
    await mongoose.connect(config.database_url as string, {
      dbName: "nestHuntDB",
    });

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
      console.log(`🚀 Server is running successfully! 🚀`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected, closing server...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected, closing server...", err);
  process.exit(1);
});
