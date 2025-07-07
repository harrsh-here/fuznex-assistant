import React from "react";
import { Trash } from "phosphor-react";
import { iconFor, summarize, formatTimestamp } from "../utils/formatters";

export default function HistoryItem({
  item,
  selectionMode,
  selected,
  onSelect,
  onDelete,
}) {
  const Icon = iconFor(item.type);

  return (
    <div
      className={`bg-[#1e1e1e] border border-[#2a2a2a] text-sm rounded-xl px-4 py-3 transition-shadow ${
        item.fadeIn ? "animate-fadeIn" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-700 p-1.5 rounded-lg text-white">
            <Icon />
          </div>
          <div>
            <div className="text-gray-200">{summarize(item)}</div>
            <div className="text-xs text-gray-500">
              {formatTimestamp(item.timestamp)}
            </div>
          </div>
        </div>

        {/* Right: Delete or Checkbox */}
        <div className="flex items-center gap-2">
          {selectionMode ? (
            <input
              type="checkbox"
              checked={selected}
              onChange={onSelect}
              className="w-4 h-4 accent-purple-600"
            />
          ) : (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 transition"
              title="Delete"
            >
              <Trash size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
