import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in as:", result.user.displayName);

      // Store user info in localStorage or sessionStorage if you want persistence
      localStorage.setItem("authUser", JSON.stringify(result.user));

      // Navigate back to home or editor after login
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed, please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Login</h1>
      <p>Please sign in to continue</p>

      {/* 👇 Login button */}
      <button
        onClick={handleLogin}
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
        Login with Google
      </button>
    </div>
  );
}
