// ProfileScreen.jsx
import React, { useMemo } from "react";
import { Gear, Clock } from "phosphor-react";

export default function ProfileScreen({
  user,
  onLogout,
  onEditProfile,
  onNavigate,
}) {
  const { name, email, avatar_url } = user || {};

  // 🎲 Choose random profile pic on first mount
  const randomPfp = useMemo(() => {
    const index = Math.floor(Math.random() * 11) + 1; // 1–11
    return `/profile-pictures/pfp${index}.png`;
  }, []);

  const profileImage = avatar_url || randomPfp || "/profile-pictures/default-avatar.png";

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-2">
        <img
          src={profileImage}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border border-gray-600"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold">{name || "Unknown User"}</div>
          <div className="text-sm text-gray-400">{email || "no-email@example.com"}</div>
        </div>
      </div>

      {/* Edit & Settings 
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

      {/* Assistant Selection 
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Default Assistant</label>
        <select className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded-xl text-white text-sm">
          <option>GPT Assistant</option>
          <option>Alexa</option>
          <option>Google Assistant</option>
        </select>
      </div>
*/}
      {/* 🔓 Interaction History */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate?.("history")}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-purple-400 rounded-xl hover:bg-purple-700/10 transition"
        >
          <Clock size={18} />
          Interaction History
        </button>
      </div>

      {/* Device & App Info */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div>
        {/*  <div className="text-sm font-semibold mb-1">Device</div>
          <div className="text-xs text-gray-400">WearOS Pixel 2</div>
          <div className="text-xs text-gray-400">Android 14</div>*/}
        </div>
        <div>
          <div className="text-sm font-semibold mb-1">App Info</div>
          <div className="text-xs text-gray-400">Version 1.0.0 MVP</div>
        
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-6 w-full py-2 mb-5 bg-red-600 hover:bg-red-700 rounded-xl transition"
      >
        Logout
      </button>
    </div>
  );
}
