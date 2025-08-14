import React from "react";

export default function StatusPanel({ volume = 50, brightness = 70 }) {
  return (
    <div className="flex gap-4 items-center mb-5 text-sm text-gray-300">
      <span>🔊 {volume}%</span>
      <span>💡 {brightness}%</span>
    </div>
  );
}
