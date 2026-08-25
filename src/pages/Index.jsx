import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        background: isDark ? "#1e1e1e" : "#fff",
        color: isDark ? "#eee" : "#333",
        minHeight: "80vh", // keeps content balanced with footer
      }}
    >
      <h1>Welcome to the Community Newsletter</h1>
      <p style={{ maxWidth: "600px", margin: "1rem auto" }}>
        Stay connected with updates, stories, and highlights from our community.
        Use the editor to draft your own contributions and share them with
        others.
      </p>
    </div>
  );
}
