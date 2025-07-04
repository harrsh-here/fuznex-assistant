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

  const now = moment();
  const dueMoment = task.due_date ? moment(task.due_date, "YYYY-MM-DD HH:mm:ss") : null;

  let dueText = null;
  if (dueMoment) {
    const isOverdue = dueMoment.isBefore(now);
    const isToday = dueMoment.isSame(now, "day");
    const isTomorrow = dueMoment.isSame(moment().add(1, "day"), "day");

    if (isOverdue) {
      dueText = (
        <span className="text-red-500">
          Overdue • {dueMoment.format("MMM D, h:mm A")}
        </span>
      );
    } else if (isToday) {
      const diff = moment.duration(dueMoment.diff(now));
      const hrs = Math.floor(diff.asHours());
      const mins = Math.floor(diff.asMinutes() % 60);
      dueText = (
        <span className="text-yellow-400">
          Due Today • {dueMoment.format("h:mm A")} ({hrs > 0 ? `${hrs}h ` : ""}
          {mins}m left)
        </span>
      );
    } else if (isTomorrow) {
      dueText = (
        <span className="text-blue-400">
          Due Tomorrow • {dueMoment.format("h:mm A")}
        </span>
      );
    } else {
      dueText = (
        <span className="text-purple-400">
          Due on {dueMoment.format("MMM D, h:mm A")}
        </span>
      );
    }
  }

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
    <div className="bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1 hover:border-purple-600">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          {/* ✅ Checkbox + Priority */}
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
            {getPriorityDotColor() && (
              <div
                className={`w-2 h-2 rounded-full ${getPriorityDotColor()}`}
                title={`Priority: ${task.priority}`}
              />
            )}
          </div>

          {/* ✅ Task Info */}
          <div onClick={() => onOpenDetail(task)} className="flex-1 min-w-0 cursor-pointer">
            <div
              className={`text-sm font-medium truncate ${
                task.is_completed ? "line-through text-gray-500" : "text-white"
              }`}
              title={task.title}
            >
              {task.title.length > 30 ? task.title.slice(0, 20) + "..." : task.title}
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

            {dueText && (
              <div className="text-xs mt-0.5">{dueText}</div>
            )}
          </div>
        </div>

        {/* ✅ Options Button */}
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
