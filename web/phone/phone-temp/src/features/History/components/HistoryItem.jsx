// src/features/History/components/HistoryItem.jsx
import React from "react";
import { Trash } from "phosphor-react";
import { summarize, formatTimestamp } from "../utils/formatters";

export default function HistoryItem({
  item,
  selectionMode,
  selected,
  onSelect,
  onDelete,
}) {
  // Emoji map for different types
  const emojiMap = {
    alarm: "⏰",
    todo: "📝",
    chat: "💬",
    system: "⚙️",
  };
  const emoji = emojiMap[item.type] || "📄";

  const cardClasses = `
    flex items-center justify-between px-4 py-3 rounded-xl border
    ${selected ? "border-purple-500 bg-[#2a2a2a]" : "border-[#2a2a2a] bg-[#1e1e1e]"}
    hover:border-purple-600 transition-all duration-200
    ${item.fadeIn ? "animate-fadeIn" : ""}
  `;

  return (
    <div
      className={cardClasses}
      onClick={selectionMode ? onSelect : undefined}
      role="button"
    >
      {/* Left side: emoji + info */}
      <div className="flex items-center gap-3">
        <span className="text-lg">{emoji}</span>

        <div className="flex flex-col">
          <div className="text-sm font-medium text-white leading-tight">
            {summarize(item)}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {formatTimestamp(item.timestamp)}
          </div>
        </div>
      </div>

      {/* Right: delete or checkbox */}
      {!selectionMode ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          
          }}
          className="text-red-500 hover:text-red-600"
          title="Delete entry"
        >
          <Trash size={18} />
        </button>
      ) : (
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 accent-purple-600"
        />
      )}
    </div>
  );
}
