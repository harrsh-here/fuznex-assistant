import React, { useState } from "react";
import { Bell, PlusCircle } from "lucide-react";

const upcomingEvents = [
  "📅 Meeting at 4:00 PM with the AI team.",
  "📝 Grocery shopping before 6 PM.",
  "⏰ Alarm set for morning walk at 6:30 AM.",
];

export default function HomeScreen({ onNavigate, user }) {
  const [expandedText, setExpandedText] = useState(null);
  const { name, avatar_url } = user || {};

  const handleExpand = (text) => setExpandedText(text);
  const closeExpand = () => setExpandedText(null);

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white bg-[#0f0f0f] overflow-y-auto scrollbar-none">
      
      {/* Greeting */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            Hello, {(name?.split(" ")[0]) || "User"} 👋
          </h2>
          <p className="text-xs text-gray-400">
            What would you like me to do?
          </p>
        </div>
        <button
          className="relative bg-transparent"
          onClick={() => onNavigate("notifications")}
        >
          <Bell className="w-6 h-6 text-purple-400 " />
          <span className="absolute top-[4px] right-[17px] w-2 h-2 bg-purple-500 rounded-full" />
        </button>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2 bg-[#1e1e1e] p-4 rounded-xl border border-[#2a2a2a]">
          <button
            onClick={() => onNavigate("plans", { tab: "tasks" })}
            className="text-left text-sm text-white hover:text-purple-400 transition"
          >
            Tasks
          </button>
          <button
            onClick={() => onNavigate("plans", { mode: "add-task" })}
            className="flex items-center gap-2 text-xs text-purple-400 hover:underline"
          >
            <PlusCircle size={16} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-2 bg-[#1e1e1e] p-4 rounded-xl border border-[#2a2a2a]">
          <button
            onClick={() => onNavigate("plans", { tab: "alarms" })}
            className="text-left text-sm text-white hover:text-purple-400 transition"
          >
            Alarms
          </button>
          <button
            onClick={() => onNavigate("plans", { mode: "add-alarm" })}
            className="flex items-center gap-2 text-xs text-purple-400 hover:underline"
          >
            <PlusCircle size={16} /> Add
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Upcoming Events</h3>
        <div className="space-y-3">
          {upcomingEvents.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleExpand(item)}
              className="cursor-pointer text-sm bg-[#1e1e1e] px-4 py-2 rounded-xl border border-[#2a2a2a] hover:bg-[#272727] transition"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />

      {/* Expanded Detail Overlay */}
      {expandedText && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5"
          onClick={closeExpand}
        >
          <div
            className="bg-[#1e1e1e] border border-gray-700 text-sm text-white rounded-2xl p-6 max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {expandedText}
          </div>
        </div>
      )}
    </div>
  );
}
