import React, { useState } from "react";
import { DotsThreeVertical, Alarm } from "phosphor-react";
import moment from "moment";
import api from "../../api/api";

export default function AlarmCard({ alarm, onOptions, onEdit, onOpenDetail, reload }) {
  const [isActive, setIsActive] = useState(alarm.is_active);
  const [loading, setLoading] = useState(false);

  const alarmTimeDisplay = moment(alarm.alarm_time).format("h:mm A");

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (loading) return;

    const newState = !isActive;
    setIsActive(newState); // Optimistic UI update

    setLoading(true);
    try {
      console.log("Toggling alarm:", alarm.alarm_id);

      await api.put(`/alarms/${alarm.alarm_id}/toggle`);
      if (reload) reload(); // optional, in case you want full data refresh
    } catch (err) {
      console.error("Toggle failed:", err);
      setIsActive(!newState); // Revert toggle if failed
    }
    setLoading(false);
  };

  return (
    <div
      className={`relative bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1 hover:border-purple-600 ${
        !isActive ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div
          className="flex gap-3 items-start flex-1 cursor-pointer"
          onClick={() => onOpenDetail(alarm)}
        >
          <Alarm size={18} className="text-purple-400 mt-1" />
          <div className="min-w-0">
           <div className="text-sm font-medium text-white truncate" title={alarm.label}>
  {(alarm.label || "Unnamed Alarm").length > 15
    ? (alarm.label || "Unnamed Alarm").slice(0, 15) + "..."
    : alarm.label || "Unnamed Alarm"}
</div>

            <div className="text-xs text-gray-400">{alarmTimeDisplay}</div>
            {alarm.repeat_pattern && (
              <div className="text-xs text-gray-500 truncate">
                {alarm.repeat_pattern}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isActive}
              onChange={handleToggle}
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
