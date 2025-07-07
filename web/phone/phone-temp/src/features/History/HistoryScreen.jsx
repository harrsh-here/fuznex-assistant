import React, { useState, useRef, useEffect } from "react";
import {
  CaretLeft,
  Trash,
  CheckCircle,
} from "phosphor-react";
import { ListChecks } from "lucide-react"; // or your icon library

import useHistory from "./hooks/useHistory";
import HistoryToolbar from "./components/HistoryToolbar";
import HistoryList from "./components/HistoryList";
import HistoryEmptyState from "./components/HistoryEmptyState";
import LoadingSkeleton from "./components/LoadingSkeleton";

export default function HistoryScreen({ navigate }) {
  const [filters, setFilters] = useState({ type: "all", assistant: "all" });
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const { groups = [], loading, reload, deleteHistory } = useHistory(filters);
  const refreshRef = useRef(null);

  // Silent auto-refresh every 7 seconds
  useEffect(() => {
    reload();
    refreshRef.current = setInterval(() => reload(true), 7000);
    return () => clearInterval(refreshRef.current);
  }, [filters]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const confirmBatchDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteHistory(id)));
      setToastMsg("Deleted selected history");
      reload();
    } catch {
      alert("Failed to delete history");
    } finally {
      setShowDeleteConfirm(false);
      cancelSelection();
      setTimeout(() => setToastMsg(null), 2200);
    }
  };

  const deleteSingle = async (id) => {
    try {
      await deleteHistory(id);
      setToastMsg("Deleted");
      reload();
    } catch {
      alert("Failed to delete item");
    } finally {
      setTimeout(() => setToastMsg(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate?.(-1)}
          className="p-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] text-gray-300 hover:text-white"
        >
          <CaretLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Interaction History</h2>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Filter Toolbar (Planner style) */}
      {!selectionMode && (
        <div className="mb-4">
          <HistoryToolbar filters={filters} setFilters={setFilters} />
        </div>
      )}

      {/* Select Mode Actions */}
      {selectionMode && (
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <Trash size={16} /> Delete ({selectedIds.length})
          </button>
          <button
            onClick={cancelSelection}
            className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {loading ? (
          <LoadingSkeleton />
        ) : groups.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          <HistoryList
            groupedHistory={groups}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            onSelect={toggleSelect}
            onDelete={deleteSingle}
          />
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed left-1/2 transform -translate-x-1/2 bg-[#1e1e1e] border border-purple-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 text-sm max-w-[90%]"
          style={{ bottom: "9.5rem" }}
        >
          <CheckCircle size={16} className="text-green-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 w-[85%] max-w-[320px] text-center shadow-xl">
            <p className="text-white mb-4">
              Delete {selectedIds.length} selected{" "}
              {selectedIds.length > 1 ? "entries" : "entry"}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmBatchDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Select Multiple FAB */}
{!selectionMode && groups.length > 0 && !loading && (
  <button
    onClick={() => setSelectionMode(true)}
    className="mb-9 flex items-center justify-between gap-30 fixed bottom-24 right-1500left-1800 p-4 bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg text-black z-50 transition-transform hover:scale-110"
    title="Select Multiple"
  >
    <span className="text-lg font-bold"><ListChecks size={24} /></span>
  </button>
)}

    </div>
  );
}
