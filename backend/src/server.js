import "dotenv/config";
import dns from "node:dns";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

// Optional DNS override for environments where SRV resolution fails.
if (process.env.DNS_FALLBACK === "true") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const parsedPort = Number(process.env.PORT);
let PORT;

if (
  Number.isNaN(parsedPort) ||
  !Number.isInteger(parsedPort) ||
  parsedPort < 1 ||
  parsedPort > 65535
) {
  PORT = 3000;
} else {
  PORT = parsedPort;
}

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    server.on("error", (error) => {
      logger.error({ err: error }, "Failed to start the server");
      process.exit(1);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to the database");
    process.exit(1);
  }
};
startServer();
