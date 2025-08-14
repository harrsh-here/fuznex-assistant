
// [DeleteAllModal.jsx]
import React from "react";
import api from "../../api/api";

export default function DeleteAllModal({ items, type, onClose, onDeleted }) {
  const route = type === "tasks" ? "todos" : "alarms";

  const handleDeleteAll = async () => {
    for (let id of items) {
      try {
        await api.delete(`/${route}/${id}`);
      } catch (err) {
        console.error("Failed to delete:", id);
      }
    }
    onDeleted();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-600 w-[90%] max-w-sm">
        <h3 className="text-lg font-semibold mb-3 text-white">Delete Selected {type}?</h3>
        <p className="text-gray-400 mb-4">This will delete all selected {type}. Are you sure?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn border-gray-500 text-gray-300">Cancel</button>
          <button onClick={handleDeleteAll} className="btn bg-red-600 text-white hover:bg-red-700">Delete All</button>
        </div>
      </div>
    </div>
  );
}
