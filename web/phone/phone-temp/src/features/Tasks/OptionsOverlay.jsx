// src/components/OptionsOverlay.jsx
import React from "react";
import { Trash, PencilSimple } from "phosphor-react";

export default function OptionsOverlay({ onEdit, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#1c1c1c] border border-gray-700 p-5 rounded-xl w-72 space-y-4">
        <h3 className="text-lg font-semibold mb-2">More Options</h3>
        <button
          className="flex items-center gap-2 text-left w-full text-gray-300 hover:text-white"
          onClick={onEdit}
        >
          <PencilSimple size={16} /> Edit
        </button>
        <button
          className="flex items-center gap-2 text-left w-full text-red-400 hover:text-red-600"
          onClick={onDelete}
        >
          <Trash size={16} /> Delete
        </button>
        <button
          className="w-full py-2 mt-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
