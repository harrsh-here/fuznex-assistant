// src/features/Tasks/TasksScreen.jsx
import React from "react";

export default function TasksScreen() {
  return (
    <div className="flex flex-col gap-4 text-sm text-gray-800">
      {/* Header */}
      <h2 className="text-base font-semibold">Your Tasks & Alarms</h2>

      {/* Add New Task */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl"
        />
        <button className="bg-black text-white px-4 py-2 rounded-xl">+</button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span>Buy groceries</span>
          <input type="checkbox" />
        </div>
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span>Call doctor</span>
          <input type="checkbox" />
        </div>
      </div>

      {/* Alarms Section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Set Alarms</h3>
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between bg-blue-100 text-blue-800 p-3 rounded-lg">
            <span>⏰ 06:00 AM</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between bg-blue-100 text-blue-800 p-3 rounded-lg">
            <span>⏰ 08:00 AM</span>
            <input type="checkbox" />
          </div>
        </div>
      </div>
    </div>
  );
}
