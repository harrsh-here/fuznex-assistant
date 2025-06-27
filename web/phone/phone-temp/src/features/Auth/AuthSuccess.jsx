import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function AuthSuccess({ onAuth }) {
  const [status, setStatus] = useState("Logging you in...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setStatus("Missing tokens. Redirecting...");
      return;
    }

    // Store tokens
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Fetch user profile and log them in
    api
      .get("/users/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(({ data }) => {
        onAuth(data); // Calls the parent App to update state
      })
      .catch((err) => {
        console.error("AuthSuccess error:", err);
        setStatus("Failed to fetch profile. Please login again.");
      });
  }, [onAuth]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-purple-400 font-sans px-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-2xl font-bold">FuzNex Assistant</h2>
        <p className="text-sm">{status}</p>
      </div>
    </div>
  );
}
