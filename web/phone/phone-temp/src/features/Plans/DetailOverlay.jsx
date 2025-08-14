import React from "react";
import moment from "moment";

export default function DetailOverlay({ alarm, item, mode, onEdit, onDelete, onClose }) {
  const isTask = mode === "tasks";
  const detail = item || {};

  const getField = (value) =>
    value === undefined || value === null || value === "" ? "N/A" : value;

  // ✅ Format task due date (trust backend value as IST)
  const formattedDueDate = detail.due_date
    ? moment(detail.due_date, "YYYY-MM-DD HH:mm:ss").format("MMM D, YYYY • h:mm A")
    : "N/A";

  // ✅ Format alarm time (trust backend value as IST)
  const formattedAlarmTime = detail.alarm_time
    ? moment(detail.alarm_time, "YYYY-MM-DD HH:mm:ss").format("MMM D, YYYY • h:mm A")
    : "N/A";

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-lg relative text-sm text-gray-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-400 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          {isTask ? "Task Details" : "Alarm Details"}
        </h2>

        <div className="space-y-3">
          {/* Title/Label */}
          <div>
            <strong>{isTask ? "Title" : "Label"}:</strong>
            <div className="text-white mt-1 line-clamp-3 leading-snug break-words">
              {getField(isTask ? detail.title : detail.label)}
            </div>
          </div>

          {/* Description (for tasks only) */}
          {isTask && (
            <div>
              <strong>Description:</strong>
              <div className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
                {getField(detail.description)}
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div>
            <strong>Status:</strong>{" "}
            {isTask
              ? detail.is_completed
                ? <>Completed </>
                : "Pending"
              : detail.is_active
              ? "Active"
              : "Inactive"}
          </div>

          {isTask ? (
            <>
              <div>
                <strong>Priority:</strong> {getField(detail.priority)}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {detail.created_at
                  ? moment(detail.created_at, "YYYY-MM-DD HH:mm:ss").format("MMM D, YYYY • h:mm A")
                  : "N/A"}
              </div>
              <div>
                <strong>Due:</strong> {formattedDueDate}
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Time:</strong> {formattedAlarmTime}
              </div>
              <div>
                <strong>Repeat:</strong> {getField(detail.repeat_pattern)}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onEdit}
            className="px-4 py-1.5 bg-blue-600 rounded hover:bg-blue-700 text-white text-sm"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-1.5 bg-red-600 rounded hover:bg-red-700 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
