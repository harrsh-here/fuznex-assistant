// src/features/Home/HomeScreen.jsx
import React from "react";
import { Mic, Send } from "lucide-react";

export default function HomeScreen() {
  return (
    <div className="flex flex-col h-full justify-between px-3 py-5">
      {/* Top Greeting */}
      <div className="space-y-1 text-gray-800">
        <h2 className="text-xl font-bold">Hello, Harsh 👋</h2>
        <p className="text-sm text-gray-500">What would you like me to do?</p>
      </div>

      {/* Recent Activity */}
      <div className="mt-5 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h3>
        <div className="space-y-2">
          <div className="bg-white shadow rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200">
            🔔 Alarm set for 7:00 AM
          </div>
          <div className="bg-white shadow rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200">
            ✅ Task "Submit report" completed
          </div>
          <div className="bg-white shadow rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200">
            💬 GPT: "Here's the weather..."
          </div>
        </div>
      </div>

      {/* Input Field */}
      <div className="mt-4 pt-3 flex items-center gap-2 border-t border-gray-200">
        <button className="p-2 rounded-full bg-gray-100 shadow-md">
          <Mic className="w-5 h-5 text-gray-600" />
        </button>
        <input
          type="text"
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button className="p-2 rounded-full bg-black shadow-md">
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
