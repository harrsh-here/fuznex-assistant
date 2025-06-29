// src/features/Tasks/TaskCard.jsx
import React from "react";
import { DotsThreeVertical } from "phosphor-react";
import moment from "moment";

export default function TaskCard({ task, onOptions, onEdit, onOpenDetail }) {
  // Format due date as relative (e.g. “Due in 2 days”) if exists
  const dueDateText = task.due_date
    ? `Due ${moment(task.due_date).fromNow(true)}`
    : null;

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className="bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1 cursor-pointer hover:border-purple-600"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 flex-1">
          {task.priority !== "low" && (
            <span
              className={`w-2 h-2 rounded-full ${
                task.priority === "high"
                  ? "bg-green-400"
                  : task.priority === "medium"
                  ? "bg-yellow-400"
                  : ""
              }`}
            />
          )}
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium truncate ${
                task.is_completed ? "line-through text-gray-500" : "text-white"
              }`}
              title={task.title}
            >
              {task.title}
            </div>
            {task.description && (
              <div
                className="text-xs text-gray-400 truncate"
                title={task.description}
              >
                {task.description.length > 50
                  ? task.description.slice(0, 50) + "..."
                  : task.description}
              </div>
            )}
            {dueDateText && (
              <div className="text-xs text-purple-400">{dueDateText}</div>
            )}
          </div>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
             const rect = e.currentTarget.getBoundingClientRect();
            onOptions(task,rect);
          }}
          className="text-gray-400 hover:text-purple-400"
          aria-label="Task options"
        >
          <DotsThreeVertical size={18} />
        </button>
      </div>
    </div>
  );
}
