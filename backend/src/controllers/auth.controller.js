import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import generateToken from "../utils/jwt.js";
import BlacklistedToken from "../models/blacklistedToken.model.js";
import hashToken from "../utils/hashToken.js";
async function login(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (typeof email !== "string" || typeof password !== "string") {
      logger.warn("Email and password must be strings");
      return res
        .status(400)
        .json({ message: "Email and password must be strings" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      logger.warn("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn("Invalid password");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    logger.info("User is successfully logged in");
    res.status(200).json({
      message: "User is successfully logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function signup(req, res, next) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      logger.warn("Name, email, and password must be strings");
      return res.status(400).json({
        message: "Name, email, and password must be strings",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      logger.warn("Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    await newUser.save();
    const token = generateToken(newUser._id);
    logger.info("User is successfully created");
    res.status(201).json({
      message: "User is successfully created",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      logger.warn("Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const tokenHash = hashToken(req.token);
    const userId = req.user.userId;
    const expiresAt = new Date(req.user.exp * 1000);
    const blacklistedToken = new BlacklistedToken({
      tokenHash,
      userId,
      expiresAt,
    });
    await blacklistedToken.save();

    logger.info("User is successfully logged out");
    return res.status(200).json({ message: "User is successfully logged out" });
  } catch (error) {
    if (error.code === 11000) {
      logger.info("User is already logged out");
      return res
        .status(200)
        .json({ message: "User is successfully logged out" });
    }
    next(error);
  }
}

export { login, signup, logout };
