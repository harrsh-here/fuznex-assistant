import React from "react";
import moment from "moment";

export default function NotificationCard({
  notification,
  onNavigate,
  onMarkAsRead,
}) {
  const {
    notification_id,
    title,
    message,
    reminder_time,
    is_read,
    task_id,
    alarm_id,
    priority = "low", // default fallback
  } = notification;

  const isUpcoming =
    reminder_time && moment(reminder_time).diff(moment(), "minutes") <= 5;

  // Priority Dot Color
  const priorityDot =
    priority === "high" ? "bg-red-500" :
    priority === "medium" ? "bg-yellow-400" :
    "";

  const handleClick = () => {
    if (!is_read) onMarkAsRead(notification_id);

    if (task_id) onNavigate("planner", { taskId: task_id });
    else if (alarm_id) onNavigate("planner", { alarmId: alarm_id });
    else if (notification.device_id) onNavigate("devices");
  };

  return (
    <div
      onClick={handleClick}
      className={`relative px-4 py-3 rounded-xl border text-sm cursor-pointer transition 
        ${is_read ? "bg-[#181818] text-gray-500" : "bg-[#1e1e1e] text-gray-200"} 
        border-[#2a2a2a] hover:border-purple-600`}
    >
      {/* Priority Dot */}
      {priorityDot && (
        <span
          className={`absolute left-2 top-2 w-2.5 h-2.5 rounded-full ${priorityDot}`}
        ></span>
      )}

      {/* Title */}
      <div className="font-medium truncate pr-4">{title || "No Title"}</div>

      {/* Message or Time */}
      <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
        {message?.length > 100
          ? message.slice(0, 100) + "..."
          : message || "No message"}
      </div>

      {/* Alarm Soon Text */}
      {isUpcoming && alarm_id && (
        <div className="text-xs text-purple-400 mt-1">
          Alarm in {moment(reminder_time).diff(moment(), "minutes")} minute(s)
        </div>
      )}
    </div>
  );
}
