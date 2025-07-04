// src/features/Tasks/OptionsOverlay.jsx
import React from "react";

export default function OptionsOverlay({ onEdit, onDelete, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 px-6">
      <div className="bg-[#1e1e1e] rounded-xl p-4 w-full max-w-xs text-sm shadow-xl border border-[#333]">
        <div className="text-white font-medium mb-3">Quick Actions</div>
        <button
          onClick={onEdit}
          className="w-full py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition text-white mb-2"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={loading}
          className="w-full py-2 rounded-md bg-red-600 hover:bg-red-700 transition text-white mb-2"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
