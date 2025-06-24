// src/features/Profile/ProfileScreen.jsx
import React from "react";
import { Gear } from "phosphor-react"; // or any other icon library you're using

export default function ProfileScreen({ user, onLogout, onEditProfile }) {
  const { name, email, avatar_url } = user || {};

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-2">
        <img
          src={avatar_url || "/profile-pictures/default-avatar.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border border-gray-600"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold">{name || "Unknown User"}</div>
          <div className="text-sm text-gray-400">{email || "no-email@example.com"}</div>
        </div>
      </div>

    {/* Edit Profile & Settings */}
<div className="flex justify-between items-center mb-4">
  <button
    onClick={onEditProfile}
    className="text-xs text-purple-400 underline"
  >
    Edit Profile
  </button>
  <button
    onClick={() => console.log("Settings clicked")}
    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
  >
    <Gear size={16} />
    Settings
  </button>
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

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl transition"
      >
        Logout
      </button>
    </div>
  );
}
