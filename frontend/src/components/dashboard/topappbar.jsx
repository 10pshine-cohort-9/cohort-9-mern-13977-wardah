import React from "react";

export default function TopAppBar({
  user,
  notesCount,
  showSearchInput,
  searchTerm,
  setSearchTerm,
  searchInputRef,
  onToggleSearch,
  isProfileOpen,
  setIsProfileOpen,
  onLogout,
}) {
  return (
    <header className="top-appbar">
      <div className="logo">
        <svg
          className="logo-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
        <span>Notely</span>
      </div>

      <div className="top-actions">
        {showSearchInput && (
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="top-search-field"
          />
        )}

        {/* Search Toggle Button */}
        <button
          className={`appbar-icon-btn ${showSearchInput ? "active" : ""}`}
          onClick={onToggleSearch}
          title="Search"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Profile Popover */}
        <div className="profile-menu-container">
          <button
            className={`appbar-icon-btn ${isProfileOpen ? "active" : ""}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="Profile"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {isProfileOpen && (
            <>
              <div
                className="dropdown-invisible-backdrop"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="profile-dropdown-card">
                <div className="profile-avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h3 className="profile-name">{user?.name || "User"}</h3>
                <p className="profile-email">
                  {user?.email || "No email available"}
                </p>

                <div className="profile-stats-box">
                  <span className="stats-label">Total Notes</span>
                  <span className="stats-value">{notesCount}</span>
                </div>

                <button
                  type="button"
                  className="btn-logout-dropdown"
                  onClick={onLogout}
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Top Navbar Direct Logout Icon */}
        <button className="appbar-icon-btn" onClick={onLogout} title="Logout">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
