import React from "react";

export default function Toolbar({ onFormat }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1rem",
        borderBottom: "1px solid #ddd",
        paddingBottom: "0.5rem",
      }}
    >
      <button onClick={() => onFormat("**", "**")}><b>B</b></button>
      <button onClick={() => onFormat("*", "*")}><i>I</i></button>
      <button onClick={() => onFormat("# ", "")}>H1</button>
      <button onClick={() => onFormat("## ", "")}>H2</button>
      <button onClick={() => onFormat("- ", "")}>• List</button>
      <button onClick={() => onFormat("`", "`")}>Code</button>
      <button onClick={() => onFormat("[", "](url)")}>Link</button>
    </div>
  );
}
