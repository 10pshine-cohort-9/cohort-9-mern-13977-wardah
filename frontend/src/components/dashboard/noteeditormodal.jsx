import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const editorModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function NoteEditorModal({
  title,
  content,
  modalError,
  isSaving,
  setTitle,
  setContent,
  onSave,
  onClose,
}) {
  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-modal-card" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSave}>
          <input
            type="text"
            className="editor-modal-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={content}
              modules={editorModules}
              onChange={setContent}
              placeholder="Take a note..."
            />
          </div>

          {modalError && <p className="modal-error-text">{modalError}</p>}

          <div className="editor-modal-buttons">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-save"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
