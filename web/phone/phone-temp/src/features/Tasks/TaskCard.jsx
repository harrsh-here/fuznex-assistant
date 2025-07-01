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

  const getPriorityDotColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-400";
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1 hover:border-purple-600`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          {/* ✅ Independent checkbox */}
          <div className="flex flex-col items-center gap-1 mt-1 w-4">
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
            {/* Priority Dot */}
            {getPriorityDotColor() && (
              <div
                className={`w-2 h-2 rounded-full ${getPriorityDotColor()}`}
                title={`Priority: ${task.priority}`}
              ></div>
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
              {task.title.length > 30
                ? task.title.slice(0, 20) + "..."
                : task.title}
            </div>

            {task.description && (
              <div
                className="text-xs text-gray-400 truncate"
                title={task.description}
              >
                {task.description.length > 5
                  ? task.description.slice(0, 25) + "..."
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
