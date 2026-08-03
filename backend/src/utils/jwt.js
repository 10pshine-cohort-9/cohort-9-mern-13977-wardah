import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  return jwt.sign({ userId }, secretKey, { expiresIn: "7d" });
};
export default generateToken;
