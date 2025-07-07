// src/features/History/components/HistoryGroup.jsx
import React from "react";
import HistoryItem from "./HistoryItem";

export default function HistoryGroup({
  title,
  items,
  selectionMode,
  selectedIds,
  onSelect,
  onDelete,
  fadeInIds = [],
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      {items.map((item) => (
        <HistoryItem
          key={item.id}
          item={{ ...item, fadeIn: fadeInIds.includes(item.id) }}
          selectionMode={selectionMode}
          selected={selectedIds.includes(item.id)}
          onSelect={() => onSelect(item.id)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
