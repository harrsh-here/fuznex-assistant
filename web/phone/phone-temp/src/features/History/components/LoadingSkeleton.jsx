import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-3 pb-10">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-[72px] rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 space-y-2 animate-pulse"
        >
          <div className="w-1/2 h-3 bg-gray-700 rounded" />
          <div className="w-1/3 h-2 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  );
}
