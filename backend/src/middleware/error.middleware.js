const errorMiddleware = (err, req, res, next) => {
  logger.error({ err }, "Unhandled error occurred");

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
