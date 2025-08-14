// src/features/History/components/HistoryList.jsx
import React from "react";
import HistoryGroup from "./HistoryGroup";
import HistoryEmptyState from "./HistoryEmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

export default function HistoryList({
  groupedHistory = [],
  loading,
  onDelete,
  selectionMode = false,
  selectedIds = [],
  onSelect = () => {},
  fadeInIds = [],
}) {
  const allItems = Array.isArray(groupedHistory)
    ? groupedHistory.flatMap((g) => g.items)
    : [];

  if (loading) return <LoadingSkeleton />;
  if (!allItems.length) return <HistoryEmptyState />;

  return (
    <div className="space-y-6">
      {groupedHistory.map((group, idx) => (
        <HistoryGroup
          key={idx}
          title={group.title}
          items={group.items}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onDelete={onDelete}
          fadeInIds={fadeInIds}
        />
      ))}
    </div>
  );
}
