// src/features/Tasks/TasksScreen.jsx
// src/features/Tasks/TasksScreen.jsx
import React, { useState, useEffect } from "react";
import { Plus, Clock } from "phosphor-react";
import api from "../../api/api";
import TaskCard from "./TaskCard";
import AlarmCard from "./AlarmCard";
import OptionsOverlay from "./OptionsOverlay";
import AddEditOverlay from "./AddEditOverlay";

// …the rest of your TasksScreen component…


export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [optionsItem, setOptionsItem] = useState(null);
  const [addEditProps, setAddEditProps] = useState(null);

  // Undo state
  const [undoInfo, setUndoInfo] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    fetchTasks();
    fetchAlarms();
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/todos");
      setTasks(
        data.slice().sort((a, b) => {
          // incomplete first, then soonest due
          if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
          return (a.due_date ? new Date(a.due_date) : 0) - (b.due_date ? new Date(b.due_date) : 0);
        })
      );
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchAlarms = async () => {
    try {
      const { data } = await api.get("/alarms");
      setAlarms(data.slice().sort((a, b) => new Date(a.alarm_time) - new Date(b.alarm_time)));
    } catch (err) {
      console.error("Error fetching alarms:", err);
    }
  };

  // Open Add/Edit overlay
  const openAdd = () => setAddEditProps({ mode: activeTab, item: null });
  const openEdit = (item) => setAddEditProps({ mode: activeTab, item });

  const closeAddEdit = () => {
    setAddEditProps(null);
    setOptionsItem(null);
  };

  const onSave = () => {
    closeAddEdit();
    loadAll();
  };

  // Deletion with undo
  const onDelete = async () => {
    const { type, task_id, alarm_id } = optionsItem;
    const id = type === "tasks" ? task_id : alarm_id;
    const route = type === "tasks" ? "todos" : "alarms";

    // Remove immediately from UI
    const deleted =
      type === "tasks"
        ? tasks.find((t) => t.task_id === id)
        : alarms.find((a) => a.alarm_id === id);
    if (type === "tasks") setTasks((prev) => prev.filter((t) => t.task_id !== id));
    else setAlarms((prev) => prev.filter((a) => a.alarm_id !== id));

    setOptionsItem(null);

    // Kick off real deletion after delay unless undone
    const timeoutId = setTimeout(async () => {
      try {
        await api.delete(`/${route}/${id}`);
      } catch (err) {
        console.error("Error deleting:", err);
      }
      setUndoInfo(null);
    }, 5000);

    setUndoInfo({ deleted, type, timeoutId, route });
  };

  const undoDelete = async () => {
    if (!undoInfo) return;
    clearTimeout(undoInfo.timeoutId);
    // re-create item
    try {
      await api.post(`/${undoInfo.route}`, undoInfo.deleted);
      loadAll();
    } catch (err) {
      console.error("Error undoing delete:", err);
    }
    setUndoInfo(null);
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden relative">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks & Alarms</h2>

      {/* Tabs */}
      <div className="flex mb-6 gap-4">
        {["tasks", "alarms"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-[#1e1e1e] text-gray-400"
            }`}
          >
            {tab === "tasks" ? (
              "Tasks"
            ) : (
              <>
                <Clock className="inline w-4 h-4 mr-1 align-text-bottom" />
                Alarms
              </>
            )}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex mb-4">
        <button
          onClick={openAdd}
          className="ml-auto p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {activeTab === "tasks"
          ? tasks.map((t) => (
              <TaskCard
                key={t.task_id}
                task={t}
                onOptions={() => setOptionsItem({ ...t, type: "tasks" })}
                onEdit={() => openEdit(t)}
              />
            ))
          : alarms.map((a) => (
              <AlarmCard
                key={a.alarm_id}
                alarm={a}
                onOptions={() => setOptionsItem({ ...a, type: "alarms" })}
                onEdit={() => openEdit(a)}
              />
            ))}
      </div>

      {/* Options Overlay */}
      {optionsItem && (
        <OptionsOverlay
          onEdit={() => {
            openEdit(optionsItem);
          }}
          onDelete={onDelete}
          onClose={() => setOptionsItem(null)}
        />
      )}

      {/* Add/Edit Overlay */}
      {addEditProps && (
        <AddEditOverlay
          mode={addEditProps.mode}
          item={addEditProps.item}
          onSave={onSave}
          onCancel={closeAddEdit}
        />
      )}

      {/* Undo Toast */}
      {undoInfo && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-xl flex items-center gap-4 shadow-lg">
          <span className="text-sm text-gray-200">
            {undoInfo.type === "tasks" ? "Task" : "Alarm"} deleted
          </span>
          <button
            onClick={undoDelete}
            className="text-purple-400 underline text-sm"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
