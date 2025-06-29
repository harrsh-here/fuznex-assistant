import React, { useState } from "react";

export default function UndoManager({ toasts, onUndo, onCancel }) {
  const [loadingId, setLoadingId] = useState(null);

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 px-4">
      <div className="space-y-2 max-w-xs w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#1e1e1e] border border-gray-700 text-white p-3 rounded-lg flex justify-between items-center shadow"
          >
            <div className="text-sm truncate mr-2">
              Deleted {toast.type === "tasks" ? "task" : "alarm"}:{" "}
              <strong>{toast.title}</strong>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={async () => {
                  if (loadingId) return;
                  setLoadingId(toast.id);
                  await onUndo(toast);
                  setLoadingId(null);
                }}
                className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50"
                disabled={loadingId === toast.id}
              >
                {loadingId === toast.id ? "Undoing..." : "Undo"}
              </button>
              <button
                onClick={() => {
                  if (loadingId) return;
                  onCancel(toast.id);
                }}
                className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white disabled:opacity-50"
                disabled={loadingId === toast.id}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
