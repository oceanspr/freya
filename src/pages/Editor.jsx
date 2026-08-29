import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Toolbar from "../components/Toolbar";

export default function Editor() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const localToken = localStorage.getItem("authToken");
  const sessionToken = sessionStorage.getItem("authToken");
  const isLoggedIn = localToken || sessionToken;

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  // State for content + metadata
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");

  // Load editing post if available
  useEffect(() => {
    const editingData = JSON.parse(localStorage.getItem("editingPost"));
    if (editingData) {
      setText(editingData.content);
      setTag(editingData.tag || "");
      setCategory(editingData.category || "");
      setAuthor(editingData.author || "");
    }
  }, []);

  // Theme-aware syntax highlighting
  useEffect(() => {
    if (theme === "dark") {
      import("highlight.js/styles/atom-one-dark.css");
    } else {
      import("highlight.js/styles/github.css");
    }
  }, [theme]);

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

  // Unified save logic
  const handleSave = () => {
    if (!text.trim()) return;

    const savedPosts = JSON.parse(localStorage.getItem("newsletterPosts")) || [];
    const editingData = JSON.parse(localStorage.getItem("editingPost"));

    const newPost = { content: text, tag, category, author };

    if (editingData) {
      savedPosts[editingData.idx] = newPost;
      localStorage.removeItem("editingPost");
    } else {
      savedPosts.push(newPost);
    }

    localStorage.setItem("newsletterPosts", JSON.stringify(savedPosts));
    alert("✅ Post saved!");
    setText("");
    setTag("");
    setCategory("");
    setAuthor("");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Left column: editor */}
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
            background: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "#eee" : "#000",
            border: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        {/* 👇 Metadata inputs */}
        <input
          type="text"
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ marginTop: "0.5rem", padding: "0.5rem", width: "100%" }}
        />

        <input
          type="text"
          placeholder="Tag (e.g., Announcement, Tips)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          style={{ marginTop: "0.5rem", padding: "0.5rem", width: "100%" }}
        />

        <input
          type="text"
          placeholder="Category (e.g., Tech, Community)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginTop: "0.5rem", padding: "0.5rem", width: "100%" }}
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
        <button
          onClick={handleSave}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#1565C0",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save Post
        </button>
      </div>

      {/* Right column: preview */}
      <div
        style={{
          width: "50%",
          background: theme === "dark" ? "#2a2a2a" : "#f9f9f9",
          color: theme === "dark" ? "#ddd" : "#333",
          padding: "1rem",
          borderRadius: "8px",
          overflowY: "auto",
        }}
      >
        <h2>Preview</h2>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {text}
        </ReactMarkdown>
        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          🏷️ Tag: {tag || "General"} | 📂 Category: {category || "Uncategorized"} | ✍️ Author: {author || "Anonymous"}
        </p>
      </div>
    </div>
  );
}
