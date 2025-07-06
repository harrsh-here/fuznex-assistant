import React, { useState } from "react";

export default function UndoManager({ toasts, onUndo, onCancel }) {
  const [loadingMap, setLoadingMap] = useState({}); // { [id]: "undoing" | "deleting" }
  const [toastMessage, setToastMessage] = useState("");

  const setLoading = (id, action) => {
    setLoadingMap((prev) => ({ ...prev, [id]: action }));
  };

  const clearLoading = (id) => {
    setLoadingMap((prev) => {
      const newMap = { ...prev };
      delete newMap[id];
      return newMap;
    });
  };

  const handleUndo = (toast) => {
    if (loadingMap[toast.id]) return;
    setLoading(toast.id, "undoing");

    setTimeout(async () => {
      try {
        await onUndo(toast);
        setToastMessage(`Restored ${toast.type === "tasks" ? "task" : "alarm"}: "${toast.title}"`);
      } finally {
        clearLoading(toast.id);
        setTimeout(() => setToastMessage(""), 2500);
      }
    }, 0);
  };

  const handleCancel = (toast) => {
    if (loadingMap[toast.id]) return;
    setLoading(toast.id, "deleting");

    setTimeout(async () => {
      try {
        await onCancel(toast.id);
        setToastMessage(`Deleted ${toast.type === "tasks" ? "task" : "alarm"}: "${toast.title}"`);
      } finally {
        clearLoading(toast.id);
        setTimeout(() => setToastMessage(""), 2500);
      }
    }, 0);
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 px-4">
      <div className="space-y-2 max-w-xs w-full">

        {/* Undo cards */}
        {toasts.map((toast) => {
          const loadingState = loadingMap[toast.id]; // "undoing" | "deleting" | undefined

          return (
            <div
              key={toast.id}
              className="bg-[#1e1e1e] border border-gray-700 text-white p-3 rounded-lg shadow flex items-center justify-between min-h-[48px]"
            >
              {loadingState ? (
                // ✅ Show whole-popup feedback
                <div className="w-full text-center text-sm font-medium opacity-80">
                  {loadingState === "undoing" ? "Undoing..." : "Deleting..."}
                </div>
              ) : (
                // ✅ Default state
                <>
                  <div className="text-sm truncate mr-2">
                    Deleting {toast.type === "tasks" ? "task" : "alarm"}:{" "}
                    <strong>{toast.title}</strong>
                  </div>

                  <div className="flex items-center gap-1 ml-auto">
                    {/* Undo Button */}
                    <button
                      onClick={() => handleUndo(toast)}
                      className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
                    >
                      Undo
                    </button>

                    {/* Cancel (X) Button */}
                    <button
                      onClick={() => handleCancel(toast)}
                      className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white w-8 flex items-center justify-center"
                      aria-label="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* In-screen toast message */}
        {toastMessage && (
          <div className="fixed bottom-24 left-4 right-4 mx-auto bg-[#1e1e1e] border border-purple-700 text-white px-4 py-3 rounded-lg shadow z-40 text-center text-sm font-medium">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
