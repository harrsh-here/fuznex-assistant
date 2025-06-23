import React, { useState } from "react";

export default function NotificationScreen({ onBack }) {
  const [notifications, setNotifications] = useState([
    "🔔 Reminder: Meeting at 3 PM",
    "📱 Push: Battery low on WearOS device",
    "🔔 Reminder: Walk 1000 steps today"
  ]);

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-white transition"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-sm">No new notifications</p>
        ) : (
          notifications.map((note, idx) => (
            <div
              key={idx}
              className="bg-[#1e1e1e] text-gray-200 text-sm px-4 py-3 rounded-xl border border-[#2a2a2a]"
            >
              {note}
            </div>
          ))
        )}
      </div>

      {/* Clear All */}
      {notifications.length > 0 && (
        <button
          onClick={() => setNotifications([])}
          className="mt-4 py-2 w-full bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
