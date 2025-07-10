// src/features/Home/components/GreetingHeader.jsx
import React from "react";
import { Bell } from "lucide-react";

export default function GreetingHeader({ user, unreadCount = 0, onNotifications }) {
  const { name } = user || {};
  const firstName = name?.split(" ")[0] || "User";

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Hello, {firstName} 👋</h2>
        <p className="text-xs text-gray-400">What would you like me to do?</p>
      </div>

      <button
        onClick={onNotifications}
        className="relative rounded-full hover:scale-105 transition-transform bg-transparent " 
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-purple-400" />
        {unreadCount > 0 && (
          <span className="absolute top-[3px] right-[15px] w-2 h-2 bg-purple-500 rounded-full" />
        )}
      </button>
    </div>
  );
}
