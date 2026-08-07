import express from "express";
import validateObjectId from "../middleware/validateObjectId.middleware.js";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, createNote);
router.get("/", authenticateUser, getNotes);
router.get("/:id", authenticateUser, validateObjectId, getNoteById);
router.put("/:id", authenticateUser, validateObjectId, updateNote);
router.delete("/:id", authenticateUser, validateObjectId, deleteNote);

export default router;
