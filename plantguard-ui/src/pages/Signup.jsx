import React, { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();
      const cleanName = name.trim();

      if (!cleanName || !cleanEmail || !cleanPass)
        throw new Error("Please fill in all fields");
      if (cleanPass.length < 6)
        throw new Error("Password must be at least 6 characters");

      // ✅ Create new user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);

      // ✅ Add user profile to Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        name: cleanName,
        email: cleanEmail,
        createdAt: new Date(),
      });

      // ✅ Redirect to upload page
      navigate("/upload");
    } catch (e) {
      if (e.code === "auth/email-already-in-use")
        setErr("Email already registered. Try logging in.");
      else if (e.code === "auth/invalid-email")
        setErr("Invalid email format.");
      else if (e.code === "auth/weak-password")
        setErr("Weak password (minimum 6 characters).");
      else setErr(e.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#e0f7fa,#e8f5e9)",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          width: 360,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#166534",
            marginBottom: 12,
          }}
        >
          Create Account
        </h2>

        {err && <div style={{ color: "#b91c1c", marginBottom: 10 }}>{err}</div>}

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
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
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            border: "none",
            borderRadius: 8,
            background: loading ? "#9ca3af" : "#16a34a",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating…" : "Sign Up"}
        </button>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "#166534",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
}
