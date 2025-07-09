import React, { useState, useEffect } from "react";
import { Bell, PlusCircle } from "lucide-react";
import moment from "moment";
import api from "../../api/api";

export default function HomeScreen({ onNavigate, user }) {
  const { name } = user || {};
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get("/notifications")
      .then((res) => {
        const unread = res.data.filter((n) =>
          moment(n.created_at).isAfter(moment().subtract(2, "days")) &&
          !n.is_read
        );
        setUnreadCount(unread.length);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#111111] text-white relative overflow-hidden scrollbar-hide">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            Hello, {name?.split(" ")[0] || "User"} 👋
          </h2>
          <p className="text-xs text-gray-400">What would you like me to do?</p>
        </div>
        <button
          onClick={() => onNavigate("notifications")}
          className="relative"
        >
          <Bell className="w-6 h-6 text-purple-400" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Task & Alarm Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Task */}
        <div className="bg-[#1e1e1e] rounded-2xl p-4 flex justify-between items-center hover:bg-[#272727] transition">
          <button
            className="text-sm font-medium text-left text-white"
            onClick={() => onNavigate("plans", { tab: "tasks" })}
          >
            Tasks
          </button>
          <button
            onClick={() => alert("Add Task (testing mode)")}
            className="text-purple-500"
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {/* Alarm */}
        <div className="bg-[#1e1e1e] rounded-2xl p-4 flex justify-between items-center hover:bg-[#272727] transition">
          <button
            className="text-sm font-medium text-left text-white"
            onClick={() => onNavigate("plans", { tab: "alarms" })}
          >
            Alarms
          </button>
          <button
            onClick={() => alert("Add Alarm (testing mode)")}
            className="text-purple-500"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>

      {/* Upcoming Placeholder */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="text-sm font-semibold text-gray-400 mb-2">Upcoming Events</div>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4 text-sm text-gray-300 mb-4">
          📅 Meeting at 4:00 PM with the AI team.
        </div>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4 text-sm text-gray-300">
          📝 Grocery shopping before 6 PM.
        </div>
      </div>

      {/* Footer Space for future tip/fitness */}
      <div className="text-xs text-center text-gray-500 mt-4 mb-2 italic">
        More features coming soon...
      </div>
    </div>
  );
}
