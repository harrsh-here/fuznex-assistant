// src/features/Tasks/TaskCard.jsx
import React, { useState } from "react";
import { DotsThreeVertical } from "phosphor-react";
import moment from "moment";

export default function TaskCard({
  task,
  onOptions,
  onEdit,
  onOpenDetail,
  onToggleComplete,
}) {
  const [isToggling, setIsToggling] = useState(false);

  const dueDateText = task.due_date
    ? `Due ${moment(task.due_date).fromNow(true)}`
    : null;

  const handleCheckboxClick = async (e) => {
    e.stopPropagation();
    setIsToggling(true);
    await onToggleComplete(task);
    setIsToggling(false);
  };

  return (
    <div
      className={`bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1 hover:border-purple-600`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          {/* ✅ Independent checkbox, no detail trigger */}
          <div className="w-4 h-4 mt-1">
            {isToggling ? (
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={handleCheckboxClick}
                className="accent-purple-600 w-4 h-4 cursor-pointer"
              />
            )}
          </div>

          {/* ✅ This section opens detail */}
          <div
            onClick={() => onOpenDetail(task)}
            className="flex-1 min-w-0 cursor-pointer"
          >
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
          onClick={(e) => {
            e.stopPropagation();
            onOptions(task, e.currentTarget.getBoundingClientRect());
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
