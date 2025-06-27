import React, { useEffect, useState } from "react";
import { DotsThreeVertical } from "phosphor-react";
import { fetchSubtasks } from "../../api/subtasks";

export default function TaskCard({ task, onOptions }) {
  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    if (task.task_id) {
      fetchSubtasks(task.task_id).then(setSubtasks).catch(console.error);
    }
  }, [task.task_id]);

  const priorityDot = {
    high: "bg-green-400",
    medium: "bg-yellow-400",
    low: "",
  };

  const visibleSubtasks = subtasks.slice(0, 2);
  const remaining = subtasks.length - visibleSubtasks.length;

  return (
    <div className="bg-[#1e1e1e] px-4 py-3 rounded-2xl border border-[#2a2a2a] shadow space-y-1">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {task.priority !== "low" && (
            <span className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
          )}
          <div>
            <div className={`text-sm font-medium ${task.is_completed ? "line-through text-gray-500" : "text-white"}`}>
              {task.title}
            </div>
            {task.description && (
              <div className="text-xs text-gray-400">{task.description.slice(0, 50)}{task.description.length > 50 && "..."}</div>
            )}
          </div>
        </div>
        <button onClick={onOptions} className="text-gray-400 hover:text-purple-400">
          <DotsThreeVertical size={18} />
        </button>
      </div>

      {subtasks.length > 0 && (
        <div className="pl-6 pt-1 space-y-1 text-xs text-gray-300">
          {visibleSubtasks.map((s) => (
            <div key={s.subtask_id} className="truncate">
              • {s.title.length > 30 ? s.title.slice(0, 30) + "..." : s.title}
            </div>
          ))}
          {remaining > 0 && (
            <div className="text-gray-500">+{remaining} more...</div>
          )}
        </div>
      )}
    </div>
  );
}
