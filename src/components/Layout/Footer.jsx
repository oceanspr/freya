import React from "react";

export default function Footer() {
  return (
    <footer style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
      <p>&copy; {new Date().getFullYear()} Community Newsletter. All rights reserved.</p>
    </footer>
  );
}
