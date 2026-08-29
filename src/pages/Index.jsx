import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (theme === "dark") {
      import("highlight.js/styles/atom-one-dark.css");
    } else {
      import("highlight.js/styles/github.css");
    }
  }, [theme]);

  useEffect(() => {
  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "newsletterPosts"));
    const postsArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsArray);
  };
  fetchPosts();
}, []);

  const handleDelete = (idx) => {
    const updatedPosts = posts.filter((_, i) => i !== idx);
    setPosts(updatedPosts);
    localStorage.setItem("newsletterPosts", JSON.stringify(updatedPosts));
  };

  const handleEdit = (idx) => {
    const postToEdit = posts[idx];
    localStorage.setItem("editingPost", JSON.stringify({ idx, ...postToEdit }));
    navigate("/editor");
  };

  const handleClearAll = () => {
    if (window.confirm("⚠️ Are you sure you want to clear all posts?")) {
      localStorage.removeItem("newsletterPosts");
      setPosts([]);
    }
  };

  // Highlight search term inside post content
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <h1>Community Newsletter</h1>
      <p style={{ maxWidth: "600px", margin: "1rem auto" }}>
        Stay connected with updates, stories, and highlights from our community.
      </p>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          width: "60%",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {filteredPosts.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>
          No posts found. Try a different search term.
        </p>
      ) : (
        <>
          <button
            onClick={handleClearAll}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#c62828",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear All Posts
          </button>

          {filteredPosts.map((post, idx) => (
            <div
              key={idx}
              style={{
                marginTop: "2rem",
                textAlign: "left",
                background: isDark ? "#2a2a2a" : "#f9f9f9",
                color: isDark ? "#ddd" : "#333",
                padding: "1rem",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  mark: ({ children }) => (
                    <mark
                      style={{
                        background: isDark ? "#ffeb3b" : "#ffff00",
                        padding: "0 2px",
                      }}
                    >
                      {children}
                    </mark>
                  ),
                }}
              >
                {highlightText(post.content)}
              </ReactMarkdown>

              {/* Metadata display */}
              <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                🏷️ Tag: {post.tag || "General"} | 📂 Category: {post.category || "Uncategorized"} | ✍️ Author: {post.author || "Anonymous"}
              </p>

              <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(idx)}
                  style={{
                    marginRight: "0.5rem",
                    background: "#1565C0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  style={{
                    background: "#c62828",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
