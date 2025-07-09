import React from "react";

export default function UpcomingEvents({ events = [], onNavigate }) {
  const handleClick = (eventText) => {
    onNavigate("plans", { event: eventText });
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
          events.slice(0, 3).map((event, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(event)}
              className="bg-[#1e1e1e] cursor-pointer rounded-xl px-4 py-3 text-gray-200 border border-[#2a2a2a] hover:bg-[#272727] transition"
            >
              {event.length > 70 ? event.slice(0, 70) + "..." : event}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
