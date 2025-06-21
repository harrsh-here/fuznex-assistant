import React from "react";
import { Mic, Send } from "lucide-react";

export default function HomeScreen() {
  return (
    <div className="flex flex-col h-full justify-between px-5 py-6 pt-12 bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#111111] text-white">
      {/* Top Greeting */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-white">Hello, Harsh 👋</h2>
        <p className="text-sm text-gray-400">What would you like me to do?</p>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-400 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="bg-[#1e1e1e] shadow-lg rounded-xl px-4 py-3 text-sm text-gray-200 border border-[#2a2a2a]">
            🔔 Alarm set for 7:00 AM
          </div>
          <div className="bg-[#1e1e1e] shadow-lg rounded-xl px-4 py-3 text-sm text-gray-200 border border-[#2a2a2a]">
            ✅ Task "Submit report" completed
          </div>
          <div className="bg-[#1e1e1e] shadow-lg rounded-xl px-4 py-3 text-sm text-gray-200 border border-[#2a2a2a]">
            💬 GPT: "Here's the weather..."
          </div>
        </div>
      </div>

      {/* Input Field */}
      <div className="mt-6 pt-4 flex items-center gap-3 border-t border-[#2a2a2a] bg-[#1a1a1a] rounded-xl px-3 py-2 shadow-inner">
        <button className="p-2 rounded-full bg-[#272727] hover:bg-[#333] transition duration-150 ease-in-out shadow">
          <Mic className="w-5 h-5 text-purple-400" />
        </button>
        <input
          type="text"
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-xl text-sm placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out shadow">
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
