import React from "react";
import { DotsThreeVertical, Alarm } from "phosphor-react";
import moment from "moment";

export default function AlarmCard({ alarm, onOptions, onEdit, onOpenDetail }) {
  const isActive = alarm.is_active;
  const alarmTimeDisplay = moment(alarm.alarm_time).format("h:mm A");

  return (
    <div
      onClick={() => onOpenDetail(alarm)}
      className={`relative bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1 cursor-pointer hover:border-purple-600 ${
        !isActive ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-start flex-1">
          <Alarm size={18} className="text-purple-400 mt-1" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {alarm.label || "Unnamed Alarm"}
            </div>
            <div className="text-xs text-gray-400">{alarmTimeDisplay}</div>
            {alarm.repeat_pattern && (
              <div className="text-xs text-gray-500 truncate">{alarm.repeat_pattern}</div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => e.stopPropagation()} // Placeholder for toggling
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 transition"></div>
            <div className="absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full shadow transition peer-checked:translate-x-4"></div>
          </label>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOptions(alarm);
            }}
            className="text-gray-400 hover:text-purple-400"
            aria-label="Alarm options"
          >
            <DotsThreeVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
