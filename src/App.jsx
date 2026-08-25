import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Editor from "./Editor";
import ConsentBanner from "./components/ConsentBanner/ConsentBanner";
import CommentForm from "./components/Comments/CommentForm";
import CommentList from "./components/Comments/CommentList";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <Header />
        
        <h1>Community Newsletter Editor</h1>
        <Editor />

        {/* Privacy & Consent Banner */}
        <ConsentBanner />

        {/* Comments Section */}
        <section style={{ marginTop: "2rem" }}>
          <h2>Community Comments</h2>
          <CommentForm />
          <CommentList />
        </section>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
