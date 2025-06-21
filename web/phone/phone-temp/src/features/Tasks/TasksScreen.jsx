// src/features/Tasks/TasksScreen.jsx
import React from "react";

export default function TasksScreen() {
  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4">Your Tasks & Alarms</h2>

      {/* Add New */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition">
          +
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Tasks Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Tasks</h3>
          <div className="space-y-3">
            {[
              { text: "Buy groceries", done: false },
              { text: "Call John", done: true },
            ].map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow"
              >
                <span className="text-sm text-gray-200">{task.text}</span>
                <input
                  type="checkbox"
                  defaultChecked={task.done}
                  className="w-4 h-4 accent-purple-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alarms Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Alarms</h3>
          <div className="space-y-3">
            {[
              { time: "06:00 AM", on: true },
              { time: "08:00 AM", on: false },
            ].map((alarm, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow"
              >
                <span className="text-sm text-gray-200">⏰ {alarm.time}</span>
                <input
                  type="checkbox"
                  defaultChecked={alarm.on}
                  className="w-4 h-4 accent-purple-400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
