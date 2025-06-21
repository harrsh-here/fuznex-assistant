// src/features/Profile/ProfileScreen.jsx
import React from "react";

export default function ProfileScreen() {
  return (
    <div className="flex flex-col gap-5 text-sm text-gray-800">
      {/* User Section */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-300 rounded-full" />
        <div>
          <div className="font-semibold">John Doe</div>
          <div className="text-xs text-gray-500">john@example.com</div>
        </div>
      </div>

      {/* Assistant Selection */}
      <div>
        <div className="font-medium mb-2">Default Assistant</div>
        <select className="w-full border rounded-lg p-2 text-sm">
          <option>GPT Assistant</option>
          <option>Alexa</option>
          <option>Google Assistant</option>
        </select>
      </div>

      {/* Device Info */}
      <div>
        <div className="font-medium mb-2">Device</div>
        <div className="text-xs text-gray-500">Smartwatch Model: WearOS Pixel 2</div>
        <div className="text-xs text-gray-500">Companion Phone: Android 14</div>
      </div>

      {/* App Info */}
      <div>
        <div className="font-medium mb-2">App Info</div>
        <div className="text-xs text-gray-500">Version: 0.1.0 MVP</div>
        <div className="text-xs text-gray-500">Build: Dev Preview</div>
      </div>

      {/* Settings Button (placeholder) */}
      <button className="bg-black text-white py-2 rounded-xl mt-2">
        App Settings
      </button>
    </div>
  );
}
