import React from "react";
import { PlusCircle } from "phosphor-react";

export default function QuickActionCard({ label, onAdd, onNavigate }) {
  return (
    <div className="relative group">
      <div
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 bg-[#1e1e1e] p-5 rounded-2xl hover:bg-[#272727] transition cursor-pointer"
      >
        <span className="font-medium text-white text-sm">{label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            onAdd();
          }}
          className="ml-2 hover:scale-110 transition text-purple-500"
          title={`Add ${label}`}
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </div>
  );
}
