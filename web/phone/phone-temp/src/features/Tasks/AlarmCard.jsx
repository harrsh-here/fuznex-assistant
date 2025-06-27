// src/features/Tasks/AlarmCard.jsx
import React from "react";
import { DotsThreeVertical, Repeat } from "phosphor-react";
import moment from "moment";

export default function AlarmCard({ alarm, onOptions }) {
  const alarmTime = alarm.alarm_time?.slice(11, 16); // HH:MM
  const ageLabel = moment(alarm.created_at).fromNow(true); // e.g., "2d"

  return (
    <div className="flex flex-col gap-1 bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={alarm.is_active}
            readOnly
            className="w-4 h-4 accent-purple-400 mt-1"
          />
          <div className="flex flex-col">
            <span className="text-sm text-gray-200">
              ⏰ {alarmTime} {alarm.label && `– ${alarm.label}`}
            </span>

            {alarm.description && (
              <span className="text-xs text-gray-400">
                {alarm.description.length > 60
                  ? alarm.description.slice(0, 60) + "..."
                  : alarm.description}
              </span>
            )}

            {alarm.repeat_pattern !== "once" && (
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <Repeat size={12} /> {alarm.repeat_pattern}
              </div>
            )}

            <span className="text-[10px] text-gray-500 mt-1">Created {ageLabel} ago</span>
          </div>
        </div>
        <button onClick={onOptions} className="text-gray-400 hover:text-purple-400">
          <DotsThreeVertical size={18} />
        </button>
      </div>
    </div>
  );
}
