// src/features/History/HistoryScreen.jsx
import React from "react";

export default function HistoryScreen() {
  const history = [
    { time: "10:42 AM", type: "command", text: "Set alarm for 6 AM" },
    { time: "10:43 AM", type: "action", text: "✅ Alarm set successfully" },
    { time: "11:10 AM", type: "command", text: "Tell GPT to write a poem" },
    { time: "11:11 AM", type: "response", text: "🌟 GPT: Roses are red..." },
    { time: "11:30 AM", type: "command", text: "Turn on Bluetooth" },
    { time: "11:30 AM", type: "action", text: "📶 Bluetooth turned on" },
  ];

  return (
    <div className="flex flex-col gap-4 text-sm text-gray-800">
      {/* Header */}
      <h2 className="text-base font-semibold">Interaction History</h2>

      {/* History List */}
      <div className="space-y-3">
        {history.map((entry, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm"
          >
            <div className="text-xs text-gray-500">{entry.time}</div>
            <div className="mt-1">
              {entry.type === "command" && <span>🗣️ {entry.text}</span>}
              {entry.type === "action" && <span>⚙️ {entry.text}</span>}
              {entry.type === "response" && <span>🤖 {entry.text}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
