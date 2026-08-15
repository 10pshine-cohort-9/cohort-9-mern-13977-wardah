import Note from "../models/note.model.js";
import logger from "../utils/logger.js";

const createNote = async (req, res, next) => {
  try {
    const body = req.body ?? {};

    if (body.title !== undefined && typeof body.title !== "string") {
      logger.warn("Title must be a string");
      return res.status(400).json({ message: "Title must be a string" });
    }

    if (body.content !== undefined && typeof body.content !== "string") {
      logger.warn("Content must be a string");
      return res.status(400).json({ message: "Content must be a string" });
    }

    const title = body.title?.trim();
    const content = body.content.trim();
    const userId = req.user.userId;

    if (!content) {
      logger.warn("Content is required");
      return res.status(400).json({ message: "Content is required" });
    }
    const note = await Note.create({
      title,
      content,
      user: userId,
    });
    logger.info(`Note created successfully: ${note._id}`);
    return res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    next(error);
  }
};
const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const notes = await Note.find({ user: userId });

    logger.info("Notes fetched successfully");

    return res.status(200).json({
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;

    const note = await Note.findOne({
      _id: noteId,
      user: userId,
    });

    if (!note) {
      logger.warn("Note not found");

      return res.status(404).json({
        message: "Note not found",
      });
    }

    logger.info("Note fetched successfully");

    return res.status(200).json({
      message: "Note fetched successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;
    const body = req.body ?? {};

    if (body.title !== undefined && typeof body.title !== "string") {
      logger.warn("Title must be a string");
      return res.status(400).json({ message: "Title must be a string" });
    }

    if (body.content !== undefined && typeof body.content !== "string") {
      logger.warn("Content must be a string");
      return res.status(400).json({ message: "Content must be a string" });
    }

    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!content) {
      logger.warn("Content is required");

      return res.status(400).json({
        message: "Content is required",
      });
    }

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        user: userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedNote) {
      logger.warn("Note not found");

      return res.status(404).json({
        message: "Note not found",
      });
    }

    logger.info("Note updated successfully");

    return res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      user: userId,
    });

    if (!deletedNote) {
      logger.warn("Note not found");
      return res.status(404).json({ message: "Note not found" });
    }

    logger.info("Note deleted successfully");
    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { createNote, getNotes, getNoteById, updateNote, deleteNote };
