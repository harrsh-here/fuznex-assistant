import React, { useState, useRef, useEffect } from "react";
import {
  CaretLeft,
  Funnel,
  ListChecks,
  Trash,
  CheckCircle,
} from "phosphor-react";

import useHistory from "./hooks/useHistory";
import HistoryList from "./components/HistoryList";
import HistoryEmptyState from "./components/HistoryEmptyState";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { filterTypes, assistantOptions } from "./utils/filterOptions";
import HistoryToolbar from "./components/HistoryToolbar";

export default function HistoryScreen({ navigate }) {
  const [filters, setFilters] = useState({
    type: "all",
    assistant: "all",
  });

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const { groups, loading, reload } = useHistory(filters);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log("🗑️ Deleting IDs:", selectedIds);
    setToastMsg("Deleted selected history");
    setTimeout(() => setToastMsg(null), 2200);
    setShowDeleteConfirm(false);
    handleCancelSelection();
    reload(); // silent refresh
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate && navigate(-1)}
          className="p-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] text-white"
        >
          <CaretLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Interaction History</h2>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Toolbar (filters) */}
      <HistoryToolbar filters={filters} setFilters={setFilters} />

      {/* Multi-select Actions */}
      <div className="flex justify-end items-center mb-4 gap-2">
        <button
          onClick={() =>
            setSelectionMode((prev) => {
              if (prev) setSelectedIds([]);
              return !prev;
            })
          }
          className="p-2 bg-yellow-600 rounded-full hover:bg-yellow-700"
          title="Select Multiple"
        >
          <ListChecks size={20} />
        </button>

        {selectionMode && (
          <button
            onClick={handleDeleteSelected}
            className="p-2 bg-red-600 rounded-full hover:bg-red-700"
            title="Delete Selected"
          >
            <Trash size={20} />
          </button>
        )}
      </div>

      {/* List / Loader / Empty */}
      {loading ? (
        <LoadingSkeleton />
      ) : groups.length === 0 ? (
        <HistoryEmptyState />
      ) : (
        <HistoryList
          groups={groups}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelect={handleToggleSelect}
          onDeleteSingle={(id) => {
            console.log("Deleting:", id);
            setToastMsg("Deleted");
            setTimeout(() => setToastMsg(null), 2200);
            reload();
          }}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed left-1/2 transform -translate-x-1/2 bg-[#1e1e1e] border border-purple-700 text-white px-4 py-2 rounded-lg shadow z-50 flex items-center gap-2 text-sm font-medium max-w-[90%] sm:max-w-[300px]"
          style={{ bottom: "9.5rem" }}
        >
          <CheckCircle size={16} className="text-green-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-5 w-[85%] max-w-[320px] text-center shadow-lg">
            <p className="text-white mb-4">
              Are you sure you want to delete {selectedIds.length} selected{" "}
              item{selectedIds.length > 1 ? "s" : ""}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowDeleteConfirm(false)}
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
