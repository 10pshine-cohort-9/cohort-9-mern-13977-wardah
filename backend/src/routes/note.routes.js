import express from "express";
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
router.get("/:id", authenticateUser, getNoteById);
router.put("/:id", authenticateUser, updateNote);
router.delete("/:id", authenticateUser, deleteNote);

export default router;
