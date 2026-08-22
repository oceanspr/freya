import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // or another theme

export default function Editor() {
  const [text, setText] = useState("");

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        cols={50}
        placeholder="Write your newsletter content here (Markdown supported)..."
        style={{ width: "50%", padding: "1rem", fontFamily: "monospace" }}
      />
      <div
        style={{
          width: "50%",
          background: "#f9f9f9",
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
