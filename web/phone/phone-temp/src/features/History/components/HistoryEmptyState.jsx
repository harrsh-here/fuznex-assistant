import React from "react";

export default function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 px-6">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-lg font-semibold text-white mb-2">No History Yet</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Your recent interactions with F.R.I.D.A.Y., tasks, alarms, and system
        actions will appear here.
      </p>
    </div>
  );
}
