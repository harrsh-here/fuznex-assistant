// src/features/History/components/HistoryList.jsx
import React, { useState, useRef } from "react";
import HistoryGroup from "./HistoryGroup";
import HistoryEmptyState from "./HistoryEmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

export default function HistoryList({
  groupedHistory,
  loading,
  onDelete,
  fadeInIds,
}) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmDeleteSelected = () => {
    if (selectedIds.length > 0) {
      setShowConfirmDelete(true);
    }
  };

  const handleConfirmedBatchDelete = () => {
    selectedIds.forEach((id) => onDelete(id));
    setSelectedIds([]);
    setSelectionMode(false);
    setShowConfirmDelete(false);
  };

  const cancelSelection = () => {
    setSelectedIds([]);
    setSelectionMode(false);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

 const allItems = Array.isArray(groupedHistory)
  ? groupedHistory.flatMap((group) => group.items)
  : [];

  if (allItems.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="relative flex-1 overflow-y-auto space-y-6 pb-20">
      {groupedHistory.map((group, i) => (
        <HistoryGroup
          key={i}
          title={group.title}
          items={group.items}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onDelete={onDelete}
          fadeInIds={fadeInIds}
        />
      ))}

      {/* Floating Actions */}
      <div className="fixed bottom-24 right-5 flex gap-2 z-50">
        {!selectionMode ? (
          <button
            onClick={() => setSelectionMode(true)}
            className="p-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-lg"
            title="Select multiple"
          >
            🧲
          </button>
        ) : (
          <>
            <button
              onClick={confirmDeleteSelected}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg"
              title="Delete selected"
            >
              🗑️
            </button>
            <button
              onClick={cancelSelection}
              className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg"
              title="Cancel selection"
            >
              ❌
            </button>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 w-[85%] max-w-[320px] text-center shadow-xl">
            <p className="text-white mb-4">
              Delete {selectedIds.length} selected history entr
              {selectedIds.length === 1 ? "y" : "ies"}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleConfirmedBatchDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
