// src/features/Notifications/NotificationCard.jsx
import React from "react";
import moment from "moment";

export default function NotificationCard({
  notification,
  onNavigate,
  onMarkAsRead,
}) {
  const {
    notification_id,
    title = "",
    message = "",
    reminder_time,
    is_read,
    task_id,
    alarm_id,
  } = notification;

  const isUpcoming =
    reminder_time && moment(reminder_time).diff(moment(), "minutes") <= 5;

  // Detect emoji based on title or message content
  const getEmoji = () => {
    const content = (title + " " + message).toLowerCase();
    if (content.includes("user") || content.includes("login")) return "👤";
    if (content.includes("task")) return "📝";
    if (content.includes("alarm")) return "⏰";
    return "🔔";
  };

  const handleClick = () => {
    if (!is_read) onMarkAsRead(notification_id);

    if (task_id) onNavigate("planner", { tab: "tasks", taskId: task_id });
    else if (alarm_id) onNavigate("planner", { tab: "alarms", alarmId: alarm_id });
    else if (title.toLowerCase().includes("user") || message.toLowerCase().includes("user")) {
      onNavigate("history");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative px-4 py-3 rounded-xl border text-sm cursor-pointer transition
        ${is_read ? "bg-[#181818] text-gray-500" : "bg-[#1e1e1e] text-gray-200"}
        border-[#2a2a2a] hover:border-purple-600`}
    >
      {/* Emoji */}
      <div className="absolute top-3 left-3 text-xl">{getEmoji()}</div>

      {/* Notification Text */}
      <div className="pl-8">
        <div className="font-medium truncate pr-4">{title || "No Title"}</div>
        <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
          {message?.length > 100 ? message.slice(0, 100) + "..." : message || "No message"}
        </div>
        {isUpcoming && alarm_id && (
          <div className="text-xs text-purple-400 mt-1">
            Alarm in {moment(reminder_time).diff(moment(), "minutes")} minute(s)
          </div>
        )}
      </div>
    </div>
  );
}
