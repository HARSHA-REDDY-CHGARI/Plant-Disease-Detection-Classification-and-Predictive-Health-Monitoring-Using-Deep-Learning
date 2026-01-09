import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Upload from "./pages/Upload.jsx";
import Result from "./pages/Result.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Functional Pages */}
        <Route path="/upload" element={<Upload />} />
        <Route path="/result" element={<Result />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
