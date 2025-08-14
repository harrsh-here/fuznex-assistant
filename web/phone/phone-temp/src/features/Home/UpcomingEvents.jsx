// src/features/Home/components/UpcomingEvents.jsx

import React, { useEffect, useState } from "react";
import moment from "moment";
import api from "../../api/api";

export default function UpcomingEvents({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const getNextOccurrence = (dateStr, pattern) => {
    let base = moment(dateStr, "YYYY-MM-DD HH:mm:ss");
    const now = moment();

    if (pattern === "once") return base;

    while (base.isBefore(now)) {
      if (pattern === "daily") base.add(1, "day");
      else if (pattern === "weekly") base.add(1, "week");
      else if (pattern === "monthly") base.add(1, "month");
      else break;
    }
    return base;
  };

  const fetchEvents = async () => {
    try {
      const [tasksRes, alarmsRes] = await Promise.all([
        api.get("/todos"),
        api.get("/alarms"),
      ]);

      const now = moment();
      const tasks = tasksRes.data || [];
      const alarms = alarmsRes.data || [];

      const formattedTasks = tasks
        .filter((t) => t.due_date && moment(t.due_date, "YYYY-MM-DD HH:mm:ss").isAfter(now))
        .map((t) => {
          const due = moment(t.due_date, "YYYY-MM-DD HH:mm:ss");
          return {
            id: t.task_id,
            type: "task",
            title: t.title,
            date: due,
            priority: t.priority || "low",
            display: `📝 ${t.title}`,
            subtext: due.format("MMM D, YYYY • hh:mm A"),
          };
        });

      const formattedAlarms = alarms
        .filter((a) => a.is_active)
        .map((a) => {
          const next = getNextOccurrence(a.alarm_time, a.repeat_pattern);
          if (next.isAfter(now)) {
            return {
              id: a.alarm_id,
              type: "alarm",
              title: a.label || "Alarm",
              date: next,
              display: `⏰ ${a.label || "Alarm"}`,
              subtext: next.format("hh:mm A"),
            };
          }
          return null;
        })
        .filter(Boolean);

      const combined = [...formattedTasks, ...formattedAlarms]
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);

      setEvents(combined);
    } catch (err) {
      console.error("[Event Fetch Error]", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasLoaded(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const getPriorityColor = (priority) => {
    if (priority === "high") return "text-red-400";
    if (priority === "medium") return "text-yellow-400";
    return "text-gray-400";
  };

  const handleClick = (eventItem) => {
    setExpandedItem(eventItem);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400">Upcoming Events</h3>
        <button
          onClick={() => onNavigate("plans")}
          className="text-purple-400 text-xs hover:underline bg-transparent border-0"
        >
          View More &gt;
        </button>
      </div>

      <div className="space-y-3 min-h-[72px]">
        {events.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10 text-gray-400">
            <div className="text-[48px] mb-2">📅</div>
            <p className="text-base font-medium">No upcoming events</p>
            <p className="text-xs mt-1 text-gray-500">Add a task or alarm to get started!</p>
          </div>
        ) : (
          events.map((event) => (
           <div
  key={event.id}
  onClick={() => handleClick(event)}
  className={`bg-[#1e1e1e] cursor-pointer rounded-xl px-4 py-2 text-gray-200 border border-[#2a2a2a] hover:bg-[#272727] 
    transform transition-all duration-700 ease-out
    ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
  `}
  style={{ maxWidth: "340px" }}
>
  <div className="text-sm font-medium truncate">{event.display}</div>
  {event.subtext && (
    <div
      className={`text-xs ${
        event.type === "task"
          ? getPriorityColor(event.priority)
          : "text-gray-400"
      }`}
    >
      {event.subtext}
    </div>
  )}
</div>

          ))
        )}
      </div>

      {expandedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-51 p-5"
          onClick={() => setExpandedItem(null)}
        >
          <div
            onClick={() => onNavigate("plans", { event: expandedItem })}
            className="bg-[#1e1e1e] border border-gray-600 text-white rounded-2xl p-6 text-sm w-full max-w-xs cursor-pointer"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Title</p>
                <p className="text-sm font-medium text-white">{expandedItem.title}</p>
              </div>
              {expandedItem.date && (
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="text-sm text-white">
                    {moment(expandedItem.date).format("MMM D, YYYY - hh:mm A")}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 pt-2">Tap anywhere to go to planner screen and view more.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
