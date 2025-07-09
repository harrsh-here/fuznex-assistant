import React from "react";
import { PlusCircle } from "phosphor-react";

export default function QuickActions({ onNavigate }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
      <div className="flex flex-col items-center bg-[#1e1e1e] rounded-2xl px-4 py-5 hover:bg-[#272727] transition">
        <button
          onClick={() => onNavigate("plans", { mode: "add-task" })}
          className="text-purple-500 hover:text-purple-600 transition"
        >
          <PlusCircle size={26} />
        </button>
        <button
          onClick={() => onNavigate("plans", { tab: "tasks" })}
          className="text-sm text-gray-300 hover:text-white mt-2"
        >
          Tasks
        </button>
      </div>

      <div className="flex flex-col items-center bg-[#1e1e1e] rounded-2xl px-4 py-5 hover:bg-[#272727] transition">
        <button
          onClick={() => onNavigate("plans", { mode: "add-alarm" })}
          className="text-purple-500 hover:text-purple-600 transition"
        >
          <PlusCircle size={26} />
        </button>
        <button
          onClick={() => onNavigate("plans", { tab: "alarms" })}
          className="text-sm text-gray-300 hover:text-white mt-2"
        >
          Alarms
        </button>
      </div>
    </div>
  );
}
