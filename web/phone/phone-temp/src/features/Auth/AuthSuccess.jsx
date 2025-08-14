import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function AuthSuccess({ onAuth }) {
  const [status, setStatus] = useState("Logging you in...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setStatus("Missing access tokens. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return;
    }

    // Store in localStorage
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Attach token manually since this is before api interceptor
    api.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        
      },
      
    })
      .then(({ data }) => {
        onAuth(data, { token: accessToken, refreshToken });
        console.log("[Tokens from URL]", accessToken, refreshToken);


      })
      .catch((err) => {
        console.error("[AuthSuccess] Profile fetch failed:", err);
        setStatus("Login failed. Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
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
