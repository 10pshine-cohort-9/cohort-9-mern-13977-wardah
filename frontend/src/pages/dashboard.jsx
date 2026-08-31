import React, { useState, useEffect, useRef } from "react";
import Toast from "../components/dashboard/toast";
import TopAppBar from "../components/dashboard/topappbar";
import Sidebar from "../components/dashboard/sidebar";
import QuickTakeBar from "../components/dashboard/quicktakebar";
import NoteCard from "../components/dashboard/notecard";
import NoteEditorModal from "../components/dashboard/noteeditormodal";
import "./dashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Dashboard({ onLogout }) {
  // 1. Data & Filter States
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 2. Editor Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 3. UI Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const searchInputRef = useRef(null);

  // Read stored user details
  const [user] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const token = localStorage.getItem("token");

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  };

  // Helper: Strip HTML tags to validate note body text
  const extractText = (html) => {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return el.textContent || el.innerText || "";
  };

  // API: Fetch All Notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setNotes(data.notes || data || []);
      } else {
        showToast(data.message || "Failed to load notes", "error");
      }
    } catch {
      showToast("Network error. Could not connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Session Validation & Lifecycle Fetch
  useEffect(() => {
    const checkAuthAndFetch = () => {
      const activeToken = localStorage.getItem("token");
      if (!activeToken) {
        onLogout();
      } else {
        fetchNotes();
      }
    };

    checkAuthAndFetch();

    // Re-verify session on browser back/forward navigation
    const handlePageShow = () => {
      if (!localStorage.getItem("token")) onLogout();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setSelectedNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setModalError("");
  };

  const handleToggleSearch = () => {
    setShowSearchInput((prev) => {
      const next = !prev;
      if (next) setTimeout(() => searchInputRef.current?.focus(), 50);
      else setSearchTerm("");
      return next;
    });
  };

  // API: Save Note (Create or Update)
  const handleSaveNote = async (e) => {
    e.preventDefault();
    const plainContent = extractText(content).trim();

    if (!plainContent && !title.trim()) {
      setModalError("Please enter a title or note content.");
      return;
    }

    setIsSaving(true);
    setModalError("");

    try {
      const isEditing = Boolean(selectedNote);
      const url = isEditing
        ? `${API_BASE_URL}/api/notes/${selectedNote._id || selectedNote.id}`
        : `${API_BASE_URL}/api/notes`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          isStarred: selectedNote ? selectedNote.isStarred : false,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        handleCloseModal();
        fetchNotes();
        showToast(
          isEditing ? "Note updated successfully" : "Note created successfully",
          "success",
        );
      } else {
        setModalError(data.message || "Could not save note");
      }
    } catch {
      setModalError("Network error while saving note");
    } finally {
      setIsSaving(false);
    }
  };

  // API: Star / Pin Toggle
  const handleToggleStar = async (e, note) => {
    e.stopPropagation();
    const noteId = note._id || note.id;
    const newStatus = !note.isStarred;

    // Fast optimistic UI update
    setNotes((prev) =>
      prev.map((n) =>
        (n._id || n.id) === noteId ? { ...n, isStarred: newStatus } : n,
      ),
    );

    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          isStarred: newStatus,
        }),
      });

      if (!res.ok) {
        setNotes((prev) =>
          prev.map((n) =>
            (n._id || n.id) === noteId ? { ...n, isStarred: !newStatus } : n,
          ),
        );
        showToast("Failed to update star", "error");
      }
    } catch {
      setNotes((prev) =>
        prev.map((n) =>
          (n._id || n.id) === noteId ? { ...n, isStarred: !newStatus } : n,
        ),
      );
      showToast("Network error updating star", "error");
    }
  };

  // API: Delete Note
  const handleDeleteNote = async (e, noteId) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => (n._id || n.id) !== noteId));
        showToast("Note deleted", "info");
      } else {
        showToast("Could not delete note", "error");
      }
    } catch {
      showToast("Network error deleting note", "error");
    }
  };

  // Real-time Search & Star Filtering
  const filteredNotes = notes.filter((note) => {
    if (activeTab === "starred" && !note.isStarred) return false;

    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const matchTitle = (note.title || "").toLowerCase().includes(term);
    const matchBody = extractText(note.content).toLowerCase().includes(term);
    return matchTitle || matchBody;
  });

  return (
    <div className="notely-dashboard-container">
      {/* Toast Feedback */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Top Header */}
      <TopAppBar
        user={user}
        notesCount={notes.length}
        showSearchInput={showSearchInput}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchInputRef={searchInputRef}
        onToggleSearch={handleToggleSearch}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        onLogout={onLogout}
      />

      {/* Main Workspace */}
      <div className="dashboard-body">
        {/* Left Sidebar */}
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCreate={handleOpenCreate}
        />

        {/* Content Feeds */}
        <main className="content-section">
          <QuickTakeBar onOpenCreate={handleOpenCreate} />

          {/* Cards or Empty/Skeleton State */}
          {loading ? (
            <div className="notes-masonry-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="note-card-skeleton">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-body-1" />
                  <div className="skeleton-line skeleton-body-2" />
                  <div className="skeleton-badge" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="status-empty-box">
              <div className="empty-icon-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h4>
                {searchTerm
                  ? "No matching notes found"
                  : activeTab === "starred"
                    ? "No starred notes yet"
                    : "No notes yet"}
              </h4>
              <p>
                {searchTerm
                  ? `No notes match "${searchTerm}". Try a different keyword.`
                  : activeTab === "starred"
                    ? "Star important notes to see them pinned here."
                    : "Organize your thoughts by creating your first note above."}
              </p>
            </div>
          ) : (
            <div className="notes-masonry-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id || note.id}
                  note={note}
                  onEdit={handleOpenEdit}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Note Editor Modal */}
      {isModalOpen && (
        <NoteEditorModal
          title={title}
          content={content}
          modalError={modalError}
          isSaving={isSaving}
          setTitle={setTitle}
          setContent={setContent}
          onSave={handleSaveNote}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
