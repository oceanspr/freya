import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    const token = "demo123";

    if (rememberMe) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }

    setMessage("✅ You’re logged in!");
    setTimeout(() => {
      navigate("/editor");
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setMessage("🚪 You’ve logged out.");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        background: isDark ? "#1e1e1e" : "#fff",
        color: isDark ? "#eee" : "#333",
        minHeight: "80vh",
      }}
    >
      <h2>Login</h2>
      <p>Click below to simulate login/logout.</p>

      <div style={{ marginTop: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />{" "}
          Remember Me
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleLogin}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            background: "#2E7D32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Log In
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            background: "#c62828",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
      </div>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}
