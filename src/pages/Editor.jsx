import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Toolbar from "../components/Toolbar"; // adjust path if needed
import { ThemeContext } from "../context/ThemeContext";
import "highlight.js/styles/github.css";

export default function Editor() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Check both storages
  const localToken = localStorage.getItem("authToken");
  const sessionToken = sessionStorage.getItem("authToken");
  const isLoggedIn = localToken || sessionToken;

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const [text, setText] = useState("");

  const handleFormat = (prefix, suffix) => {
    const textarea = document.querySelector("textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      prefix +
      selected +
      suffix +
      text.substring(end);
    setText(newText);
  };

  const loginType = localToken ? "Persistent Login" : "Session Login";

  // Theme‑aware styles
  const isDark = theme === "dark";
  const editorBg = isDark ? "#1e1e1e" : "#fff";
  const editorColor = isDark ? "#eee" : "#000";
  const previewBg = isDark ? "#2a2a2a" : "#f9f9f9";
  const previewColor = isDark ? "#ddd" : "#333";

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ width: "50%" }}>
        <Toolbar onFormat={handleFormat} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={20}
          cols={50}
          placeholder="Write your newsletter content here..."
          style={{
            width: "100%",
            padding: "1rem",
            fontFamily: "monospace",
            background: editorBg,
            color: editorColor,
            border: isDark ? "1px solid #444" : "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <p
          style={{
            marginTop: "0.5rem",
            fontWeight: "bold",
            color: loginType === "Persistent Login" ? "#2E7D32" : "#1565C0",
          }}
        >
          🔒 {loginType}
        </p>
      </div>
      <div
        style={{
          width: "50%",
          background: previewBg,
          color: previewColor,
          padding: "1rem",
          borderRadius: "8px",
          overflowY: "auto",
        }}
      >
        <h2>Preview</h2>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
