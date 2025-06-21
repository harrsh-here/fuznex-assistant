// src/features/Profile/ProfileScreen.jsx
import React from "react";

export default function ProfileScreen() {
  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-600 rounded-full" />
        <div>
          <div className="text-lg font-semibold">Harsh Patidar</div>
          <div className="text-xs text-gray-400">harsh@example.com</div>
        </div>
      </div>

      {/* Assistant Selection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Default Assistant</label>
        <select className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded-xl text-white text-sm">
          <option>GPT Assistant</option>
          <option>Alexa</option>
          <option>Google Assistant</option>
        </select>
      </div>

      {/* Device & App Info */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div>
          <div className="text-sm font-semibold mb-1">Device</div>
          <div className="text-xs text-gray-400">WearOS Pixel 2</div>
          <div className="text-xs text-gray-400">Android 14</div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-1">App Info</div>
          <div className="text-xs text-gray-400">Version 0.1.0 MVP</div>
          <div className="text-xs text-gray-400">Build Dev Preview</div>
        </div>
      </div>

      {/* Logout / Settings */}
      <button className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl shadow transition">
        Logout
      </button>
    </div>
  );
}
