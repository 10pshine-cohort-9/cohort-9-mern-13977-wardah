import React from "react";

export default function NoteCard({ note, onEdit, onToggleStar, onDelete }) {
  const noteId = note._id || note.id;
  const formattedDate = new Date(
    note.updatedAt || note.createdAt || Date.now(),
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="note-card-item" onClick={() => onEdit(note)}>
      <div className="card-top-header">
        {note.title ? (
          <h3 className="card-note-title">{note.title}</h3>
        ) : (
          <div />
        )}
        <button
          type="button"
          className={`card-star-btn ${note.isStarred ? "starred" : ""}`}
          onClick={(e) => onToggleStar(e, note)}
          title={note.isStarred ? "Unstar note" : "Star note"}
        >
          <svg
            viewBox="0 0 24 24"
            fill={note.isStarred ? "#f59e0b" : "none"}
            stroke={note.isStarred ? "#f59e0b" : "currentColor"}
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <div
        className="card-note-body"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      <div className="card-note-bottom">
        <span className="card-date-badge">{formattedDate}</span>
        <button
          className="card-delete-icon"
          onClick={(e) => onDelete(e, noteId)}
          title="Delete Note"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
