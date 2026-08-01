import pino from "pino";
const isDevelopment = process.env.NODE_ENV === "development";

const pinoOptions = {
  level: process.env.LOG_LEVEL || "info",
};

if (isDevelopment) {
  pinoOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  };
}

const logger = pino(pinoOptions);
export default logger;
