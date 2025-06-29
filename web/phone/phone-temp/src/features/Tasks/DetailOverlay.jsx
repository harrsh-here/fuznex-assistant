import React from "react";
import moment from "moment";

export default function DetailOverlay({ item, mode, onEdit, onDelete, onClose }) {
  const isTask = mode === "tasks";
  const detail = item || {};

  const getField = (value) => {
    return value === undefined || value === null || value === "" ? "N/A" : value;
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-400 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          {isTask ? "Task Details" : "Alarm Details"}
        </h2>

        <div className="space-y-2 text-sm text-gray-300">
          {isTask ? (
            <>
              <div><strong>Title:</strong> {getField(detail.title)}</div>
              <div><strong>Description:</strong> {getField(detail.description)}</div>
              <div><strong>Status:</strong> {detail.is_completed ? "Completed" : "Pending"}</div>
              <div><strong>Priority:</strong> {getField(detail.priority)}</div>
              <div>
                <strong>Created:</strong>{" "}
                {detail.created_at ? moment(detail.created_at).format("MMM D, YYYY • h:mm A") : "N/A"}
              </div>
              <div>
                <strong>Due:</strong>{" "}
                {detail.due_date ? moment(detail.due_date).format("MMM D, YYYY • h:mm A") : "N/A"}
              </div>
            </>
          ) : (
            <>
              <div><strong>Label:</strong> {getField(detail.label)}</div>
              <div><strong>Time:</strong> {detail.alarm_time ? moment(detail.alarm_time).format("h:mm A") : "N/A"}</div>
              <div><strong>Status:</strong> {detail.is_active ? "Active" : "Inactive"}</div>
              <div><strong>Repeat:</strong> {getField(detail.repeat_pattern)}</div>
              <div>
                <strong>Created:</strong>{" "}
                {detail.created_at ? moment(detail.created_at).format("MMM D, YYYY • h:mm A") : "N/A"}
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
