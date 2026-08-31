import React from "react";

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  onOpenCreate,
}) {
  return (
    <aside className="sidebar-section">
      <div className="workspace-header">
        <h2>{user?.name || "My"}</h2>
        <p>Personal Workspace</p>
      </div>

      <button className="btn-primary-create" onClick={onOpenCreate}>
        + New Note
      </button>

      <nav className="workspace-nav">
        <button
          className={`nav-link ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>Notes</span>
        </button>

        <button
          className={`nav-link ${activeTab === "starred" ? "active" : ""}`}
          onClick={() => setActiveTab("starred")}
        >
          <svg
            viewBox="0 0 24 24"
            fill={activeTab === "starred" ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Starred</span>
        </button>
      </nav>
    </aside>
  );
}
