// src/features/Home/components/UpcomingEvents.jsx

import React, { useEffect, useState } from "react";
import moment from "moment";
import api from "../../api/api";

export default function UpcomingEvents({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);

  const fetchEvents = async () => {
    try {
      const [tasksRes, alarmsRes] = await Promise.all([
        api.get("/todos"),
        api.get("/alarms")
      ]);

      const tasks = tasksRes.data || [];
      const alarms = alarmsRes.data || [];
      const now = new Date();

      const formattedTasks = tasks.map(t => {
        const hasDate = !!t.due_date;
        const dueDate = hasDate ? new Date(t.due_date) : null;

        return {
          id: t.task_id,
          type: "task",
          title: t.title,
          description: t.description || "",
          date: dueDate,
          display: hasDate
            ? `📝 ${t.title} at ${moment(t.due_date).format("hh:mm A")}`
            : `📝 ${t.title} (no due date)`
        };
      });

      const formattedAlarms = alarms.map(a => {
  const fullDate = new Date(a.alarm_time); // directly use the full datetime
  return {
    id: a.alarm_id,
    type: "alarm",
    title: a.label || "Alarm",
    date: fullDate,
    description: "",
    display: `⏰ ${a.label || "Alarm"} at ${moment(fullDate).format("hh:mm A")}`
  };
});

      const upcoming = [...formattedTasks, ...formattedAlarms]
        .filter(e => e.date && e.date > now)
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);

      if (upcoming.length > 0) {
        setEvents(upcoming);
        return;
      }

      const fallback = formattedTasks
        .filter(t => !t.date || t.date < now)
        .slice(0, 5);

      setEvents(fallback);
    } catch (err) {
      console.error("[Event Fetch Error]", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);
  const handleClick = (eventItem) => {
    setExpandedItem(eventItem);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400">Upcoming Events</h3>
        <button
          onClick={() => onNavigate("plans")}
          className="text-purple-400 text-xs hover:underline"
        >
          View More &gt;
        </button>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-xs text-gray-500">No upcoming events</div>
        ) : (
          events.map((event, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(event)}
              className="bg-[#1e1e1e] cursor-pointer rounded-xl px-4 py-3 text-gray-200 border border-[#2a2a2a] hover:bg-[#272727] transition"
            >
              {event.display.length > 70
                ? event.display.slice(0, 70) + "..."
                : event.display}
            </div>
          ))
        )}
      </div>

      {expandedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-5"
          onClick={() => setExpandedItem(null)}
        >
          <div
            onClick={() => onNavigate("plans", { event: expandedItem })}
            className="bg-[#1e1e1e] border border-gray-600 text-white rounded-2xl p-6 text-sm w-full max-w-sm cursor-pointer"
          >
            <h3 className="text-base font-semibold mb-2">
              {expandedItem.title}
            </h3>
            <p className="text-xs text-gray-400 mb-2">
 
              {expandedItem.date
                ? moment(expandedItem.date).format("MMM D, YYYY - h:mm A")
                : "No due date"}
            </p>
            <p className="text-gray-300">
              {expandedItem.description || "No description available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
