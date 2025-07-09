import React from "react";

export default function UpcomingEventsBox({ events = [], onClick }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400">Upcoming Events</h3>
        <button
          onClick={onClick}
          className="text-purple-400 text-xs hover:underline transition"
        >
          View More &gt;
        </button>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-xs text-gray-500">No upcoming events</div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              onClick={() => onClick(event)}
              className="bg-[#1e1e1e] px-4 py-2 rounded-xl text-gray-200 border border-[#2a2a2a] hover:bg-[#2a2a2a] text-sm transition cursor-pointer"
            >
              {event.length > 60 ? event.slice(0, 60) + "..." : event}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
