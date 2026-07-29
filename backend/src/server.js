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

if (Number.isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  PORT = 3000;
} else {
  PORT = parsedPort;
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error, "Failed to connect to the database: ");
    process.exit(1);
  }
};
startServer();
