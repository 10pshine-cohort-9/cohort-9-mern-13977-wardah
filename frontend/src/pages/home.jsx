import "../App.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app">
      <header className="navbar">
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

        <Link to="/login" className="login-link">
          Log In
        </Link>
      </header>

      <main className="hero">
        <section className="hero-content">
          <h1>
            Organize your
            <br />
            thoughts,
            <br />
            <span>simply.</span>
          </h1>

          <p>
            A minimalist note-taking app designed for focus and clarity. Clear
            the mental clutter and turn your ideas into structured knowledge.
          </p>

          <Link to="/signup" className="get-started-button">
            Get Started →
          </Link>
        </section>
        <section className="hero-visual">
          <div className="note-card-wrapper">
            <div className="note-card-shadow card-back-2"></div>
            <div className="note-card-shadow card-back-1"></div>

            <div className="note-card-main">
              <div className="card-top-row">
                <span className="badge">Work</span>
                <div className="bookmark-icon">★</div>
              </div>

              <div className="lines-container">
                <div className="line line-title"></div>
                <div className="line"></div>
                <div className="line-split">
                  <div className="line short"></div>
                  <div className="line medium"></div>
                </div>
                <div className="line-split">
                  <div className="line medium"></div>
                  <div className="line short"></div>
                </div>
                <div className="line short"></div>
              </div>

              <div className="edit-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
