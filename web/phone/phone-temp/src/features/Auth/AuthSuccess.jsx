// src/features/Auth/AuthSuccess.jsx
import React, { useEffect } from 'react';
import { SpinnerGap } from 'phosphor-react';
import logo from '/logo.svg'; // Adjust path if needed

export default function AuthSuccess({ onAuth }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setTimeout(() => {
        onAuth?.(null); // `null` if you want to refetch profile later in App
      }, 800);
    }
  }, []);

  return (
    <div className="absolute inset-0 bg-[#101010] flex flex-col items-center justify-center font-sans text-white space-y-6 px-4">
      <img src={logo} alt="FuzNex Logo" className="h-14 mb-2 animate-pulse" />

      <h1 className="text-2xl font-bold text-purple-400">Logging you in...</h1>

      <p className="text-gray-400 text-sm text-center max-w-xs">
        Hang tight, we’re preparing your personalized FuzNex experience.
      </p>

      <div className="mt-6">
        <SpinnerGap size={36} className="text-purple-500 animate-spin" />
      </div>
    </div>
  );
}
