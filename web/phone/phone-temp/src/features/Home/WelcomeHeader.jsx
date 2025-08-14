import React from "react";
import { Bell } from "lucide-react";

export default function WelcomeHeader({ name = "User", unreadCount = 0, onNotificationClick }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Hello, {name.split(" ")[0]} 👋</h2>
        <p className="text-xs text-gray-400">What would you like me to do?</p>
      </div>

      <button
        className="relative rounded-full"
        onClick={onNotificationClick}
      >
        <Bell className="w-6 h-6 text-purple-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
        )}
      </button>
    </div>
  );
}
