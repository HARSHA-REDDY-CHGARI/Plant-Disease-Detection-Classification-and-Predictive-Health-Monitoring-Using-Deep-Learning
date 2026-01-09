import React, { useState } from "react";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanEmail || !cleanPass) {
        alert("Please enter both email and password!");
        return;
      }

      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      console.log("✅ Logged in:", cleanEmail);
      navigate("/upload");
    } catch (err) {
      console.error("❌ Firebase Auth Error:", err.code, err.message);
      if (err.code === "auth/invalid-email") alert("Invalid email format!");
      else if (err.code === "auth/user-not-found") alert("User not found. Please sign up.");
      else if (err.code === "auth/wrong-password") alert("Incorrect password.");
      else alert(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: 12,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: 360,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: 20,
          }}
        >
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "#43a047",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: 12,
            color: "#1b5e20",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Sign up
        </p>
      </div>
    </div>
  );
}
