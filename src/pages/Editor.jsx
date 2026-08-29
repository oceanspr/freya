import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Toolbar from "../components/Toolbar";
import { auth, db } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export default function Editor() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");

  // Load editing post if available
  useEffect(() => {
    const editingData = JSON.parse(localStorage.getItem("editingPost"));
    if (editingData) {
      setText(editingData.content);
      setTag(editingData.tag || "");
      setCategory(editingData.category || "");
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

  // Save logic with Firebase
  const handleSave = async () => {
    if (!text.trim()) return;

    if (!auth.currentUser) {
      alert("⚠️ You must be logged in to save posts.");
      return;
    }

    const newPost = {
      content: text,
      tag,
      category,
      author: auth.currentUser.displayName || "Anonymous",
      createdAt: Date.now(),
    };

    const editingData = JSON.parse(localStorage.getItem("editingPost"));

    if (editingData) {
      const postRef = doc(db, "newsletterPosts", editingData.id);
      await updateDoc(postRef, newPost);
      localStorage.removeItem("editingPost");
    } else {
      await addDoc(collection(db, "newsletterPosts"), newPost);
    }

    alert("✅ Post saved to Firebase!");
    setText("");
    setTag("");
    setCategory("");
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

        {/* 👇 Metadata inputs (tag + category only) */}
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
          🏷️ Tag: {tag || "General"} | 📂 Category: {category || "Uncategorized"} | ✍️ Author:{" "}
          {auth.currentUser?.displayName || "Anonymous"}
        </p>
      </div>
    </div>
  );
}
