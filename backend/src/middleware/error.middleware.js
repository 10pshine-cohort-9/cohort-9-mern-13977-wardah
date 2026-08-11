import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error({ err }, "Unhandled error occurred");

  res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
