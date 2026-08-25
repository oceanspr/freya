import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Footer() {
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "1rem",
        textAlign: "center",
        background: isDark ? "#222" : "#f1f1f1",
        borderTop: isDark ? "1px solid #444" : "1px solid #ddd",
        color: isDark ? "#ccc" : "#555",
      }}
    >
      <p style={{ margin: 0 }}>
        © 2026 Community Newsletter · Built with ❤️ by Samuel
      </p>
    </footer>
  );
}
