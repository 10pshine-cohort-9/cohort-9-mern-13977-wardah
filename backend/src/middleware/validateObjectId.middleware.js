import mongoose from "mongoose";
import logger from "../utils/logger.js";

const validateObjectId = (req, res, next) => {
  const noteId = req.params.id;

  if (!mongoose.isValidObjectId(noteId)) {
    logger.warn("Invalid note ID");

    return res.status(400).json({
      message: "Invalid note ID",
    });
  }

  next();
};

export default validateObjectId;
