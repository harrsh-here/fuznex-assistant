import React from "react";
import TaskForm from "./TaskForm";
import AlarmForm from "./AlarmForm";

export default function AddEditOverlay({ mode, item, onSave, onCancel }) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      {mode === "tasks" ? (
        <TaskForm item={item} onSave={onSave} onCancel={onCancel} />
      ) : (
        <AlarmForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    </div>
  );
}
