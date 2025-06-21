// src/features/History/HistoryScreen.jsx
import React from "react";

export default function HistoryScreen() {
  const history = [
    { time: "10:42 AM", icon: "🗣️", text: "Set alarm for 6 AM" },
    { time: "10:43 AM", icon: "⚙️", text: "Alarm set successfully" },
    { time: "11:10 AM", icon: "💬", text: "GPT: Wrote a poem" },
    { time: "11:11 AM", icon: "💬", text: "GPT: Hello Cutie!" },
    { time: "11:30 AM", icon: "📶", text: "Bluetooth turned on" },
  ];

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4">Interaction History</h2>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {history.map((e, i) => (
          <div
            key={i}
            className="bg-[#1e1e1e] p-4 rounded-2xl shadow border border-[#2a2a2a] text-sm"
          >
            <div className="text-xs text-gray-400">{e.time}</div>
            <div className="mt-1 flex items-center gap-2">
              <span>{e.icon}</span>
              <span className="text-gray-200">{e.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
