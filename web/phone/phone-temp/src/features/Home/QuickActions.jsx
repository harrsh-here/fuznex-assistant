import React, { useState } from "react";
import { Plus } from "phosphor-react";
import AddEditOverlay from "../Plans/AddEditOverlay";

const ActionCard = ({ label, onAddClick, onTabClick }) => {
  return (
    <div
      className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-xl px-5 py-4 w-full h-20
      border border-white/20 relative
      shadow-[inset_3px_3px_8px_rgba(255,255,255,0.06)]
      hover:shadow-[inset_4px_4px_12px_rgba(255,255,255,0.07),inset_-4px_-4px_12px_rgba(0,0,0,0.4)]
      transition-all duration-300 transform hover:scale-[1.02]"
    >
      {/* Glossy Highlights */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-10" />
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-white/10 rounded-full blur-2xl opacity-10" />
      </div>

      {/* Label Text */}
      <button
        onClick={onTabClick}
        className="text-base text-gray-200 hover:text-purple-500 font-medium right-[200px] transition-colors duration-200 z-10 bg-transparent border-0 p-1"
      >
        {label}
      </button>

      {/* Right-Aligned + Icon */}
      <button
        onClick={onAddClick}
        className="bg-transparent border-[1px] outline outline-purple-700 outline-[2px] shadow-[inset_1px_9px_19px_rgba(130,00,255,0.4)] hover:pulse-[1.02] text-white rounded-full p-2 transition duration-200 shadow-md z-10"
      >
        <Plus size={20} weight="bold" />
      </button>
    </div>
  );
};

export default function QuickActions({ onNavigate }) {
  const [overlay, setOverlay] = useState(null); // 'task' | 'alarm' | null

  const closeOverlay = () => setOverlay(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
        <ActionCard
          label="Tasks"
          onAddClick={() => setOverlay("task")}
          onTabClick={() => onNavigate("plans", {}, { event: { type: "tasks" } })}

        />
        <ActionCard
          label="Alarms"
          onAddClick={() => setOverlay("alarm")}
         onTabClick={() => onNavigate("plans", {}, { event: { type: "alarms" } })}

        />
      </div>

      {overlay && (
        <AddEditOverlay
          mode={overlay === "task" ? "tasks" : "alarms"}
          item={null}
          onSave={closeOverlay}
          onCancel={closeOverlay}
        />
      )}
    </>
  );
}
