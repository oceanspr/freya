import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export default function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!(localStorage.getItem("authToken") || sessionStorage.getItem("authToken"))
  );
  const [loginType, setLoginType] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const localToken = localStorage.getItem("authToken");
      const sessionToken = sessionStorage.getItem("authToken");
      setIsLoggedIn(!!(localToken || sessionToken));
      setLoginType(localToken ? "Persistent Login" : sessionToken ? "Session Login" : null);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setLoginType(null);
    navigate("/");
  };

  return (
    <header
      style={{
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: theme === "dark" ? "#222" : "#fafafa",
        color: theme === "dark" ? "#eee" : "#333",
        padding: "0.5rem 1rem",
      }}
    >
      <h2>Community Newsletter</h2>
      <nav style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{ marginRight: "1rem", textDecoration: "none", color: "inherit" }}
        >
          Home
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            style={{ marginRight: "1rem", textDecoration: "none", color: "inherit" }}
          >
            Login
          </Link>
        ) : (
          <>
            <span style={{ marginRight: "1rem" }}>Logged in as Admin</span>
            {loginType && (
              <span
                style={{
                  marginRight: "1rem",
                  fontWeight: "bold",
                  color: loginType === "Persistent Login" ? "#2E7D32" : "#1565C0",
                }}
              >
                🔒 {loginType}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                marginRight: "1rem",
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
            <Link
              to="/editor"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Editor
            </Link>
          </>
        )}

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          style={{
            marginLeft: "1rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          title="Toggle theme"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </nav>
    </header>
  );
}
