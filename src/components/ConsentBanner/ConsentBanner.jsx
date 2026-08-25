import React, { useState, useEffect } from "react";

export default function ConsentBanner() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // Check if user already made a choice
    const savedConsent = localStorage.getItem("userConsent");
    if (savedConsent) {
      setConsent(savedConsent);
    }
  }, []);

  const handleConsent = (choice) => {
    setConsent(choice);
    localStorage.setItem("userConsent", choice);
  };

  if (consent) {
    // If user already gave consent, hide banner
    return null;
  }

  return (
    <div
      style={{
        background: "#f5f5f5",
        padding: "1rem",
        marginTop: "2rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      <p>
        We use cookies and analytics to improve your experience. Do you consent
        to data collection in line with our privacy policy?
      </p>
      <button
        onClick={() => handleConsent("accepted")}
        style={{
          marginRight: "1rem",
          padding: "0.5rem 1rem",
          background: "#2E7D32",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Accept
      </button>
      <button
        onClick={() => handleConsent("declined")}
        style={{
          padding: "0.5rem 1rem",
          background: "#c62828",
          color: "#fff",
