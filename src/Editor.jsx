import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Toolbar from "./components/Toolbar";
import "highlight.js/styles/github.css";

export default function Editor() {
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
          style={{ width: "100%", padding: "1rem", fontFamily: "monospace" }}
        />
      </div>
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
