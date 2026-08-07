import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import BlacklistedToken from "../models/blacklistedToken.model.js";
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Authorization token is required");
    return res.status(401).json({ message: "Authorization token is required" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Authorization token is required");
    return res.status(401).json({ message: "Authorization token is required" });
  }
  req.token = token;

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    logger.error("JWT_SECRET is not defined in the environment variables");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const blacklistedToken = await BlacklistedToken.findOne({ token });

    if (blacklistedToken) {
      logger.warn("Token is blacklisted");
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    return next();
  } catch (error) {
    logger.warn({ err: error }, "Invalid or expired token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default authMiddleware;
