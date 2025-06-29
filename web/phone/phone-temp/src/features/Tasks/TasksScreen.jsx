import React, { useState, useEffect } from "react";
import { Plus, Clock } from "phosphor-react";
import api from "../../api/api";

import TaskCard from "./TaskCard";
import AlarmCard from "./AlarmCard";
import OptionsOverlay from "./OptionsOverlay";
import AddEditOverlay from "./AddEditOverlay";
import DetailOverlay from "./DetailOverlay";
import UndoManager from "./UndoManager";
import LoadingSpinner from "./LoadingSpinner";

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [optionsItem, setOptionsItem] = useState(null);
  const [addEditProps, setAddEditProps] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [undoToasts, setUndoToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [tasksRes, alarmsRes] = await Promise.all([
        api.get("/todos"),
        api.get("/alarms"),
      ]);
      setTasks(sortTasks(tasksRes.data));
      setAlarms(sortAlarms(alarmsRes.data));
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  const sortTasks = (items) => {
    return [...items]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .sort((a, b) => a.is_completed - b.is_completed);
  };

  const sortAlarms = (items) => {
    return [...items]
      .sort((a, b) => new Date(b.alarm_time) - new Date(a.alarm_time))
      .sort((a, b) => b.is_active - a.is_active);
  };

  const openAdd = () => {
    setAddEditProps({ mode: activeTab, item: null });
  };

  const openEdit = (item) => {
    setAddEditProps({ mode: activeTab, item });
    setDetailItem(null);
    setOptionsItem(null);
  };

  const onSave = () => {
    setAddEditProps(null);
    loadAll();
  };

  const onDelete = async () => {
    if (!optionsItem) return;
    const { type, task_id, alarm_id, title, label } = optionsItem;
    const id = type === "tasks" ? task_id : alarm_id;

    const newItem = { ...optionsItem };
    setOptionsItem(null); // ✅ Immediately close the overlay
    setLoading(true);

    const toastId = Date.now();
    setUndoToasts((prev) => [
      { id: toastId, type, itemId: id, title: title || label },
      ...prev.slice(0, 2),
    ]);

    // Wait 5s → if not undone, delete
    setTimeout(async () => {
      const stillExists = undoToasts.find((t) => t.id === toastId);
      if (!stillExists) return;

      const route = type === "tasks" ? "todos" : "alarms";
      try {
        await api.delete(`/${route}/${id}`);
        setUndoToasts((prev) => prev.filter((t) => t.id !== toastId));
        loadAll();
      } catch (err) {
        alert("Error deleting item");
      } finally {
        setLoading(false);
      }
    }, 5000);
  };

  const applyUndo = async (toast) => {
    const { type, itemId } = toast;
    const route = type === "tasks" ? "todos/restore" : "alarms/restore";
    setLoading(true);
    try {
      await api.post(`/${route}/${itemId}`);
      setUndoToasts((prev) => prev.filter((t) => t.id !== toast.id));
      loadAll();
    } catch (err) {
      alert("Undo failed.");
    }
    setLoading(false);
  };

  const visibleTasks =
    priorityFilter === "all"
      ? tasks
      : tasks.filter((t) => t.priority === priorityFilter);

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden relative">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks & Alarms</h2>

      {/* Tabs */}
      <div className="flex mb-4 gap-4">
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
                <Clock className="inline w-4 h-4 mr-1 align-text-bottom" /> Alarms
              </>
            )}
          </button>
        ))}
      </div>

      {/* Filter + Add */}
      <div className="flex items-center justify-between mb-3 gap-3">
        {activeTab === "tasks" && (
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#1e1e1e] border border-gray-700 text-sm text-gray-300 px-3 py-2 rounded-lg focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        )}

        <button
          onClick={openAdd}
          className="ml-auto p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20">
        {activeTab === "tasks"
          ? visibleTasks.map((t) => (
              <TaskCard
                key={t.task_id}
                task={t}
                onOptions={() => setOptionsItem({ ...t, type: "tasks" })}
                onEdit={() => openEdit(t)}
                onOpenDetail={() => setDetailItem({ ...t, type: "tasks" })}
              />
            ))
          : alarms.map((a) => (
              <AlarmCard
                key={a.alarm_id}
                alarm={a}
                onOptions={() => setOptionsItem({ ...a, type: "alarms" })}
                onEdit={() => openEdit(a)}
                onOpenDetail={() => setDetailItem({ ...a, type: "alarms" })}
              />
            ))}
      </div>

      {/* Overlays */}
      {optionsItem && (
        <OptionsOverlay
          onEdit={() => openEdit(optionsItem)}
          onDelete={onDelete}
          onClose={() => setOptionsItem(null)}
        />
      )}

      {addEditProps && (
        <AddEditOverlay
          mode={addEditProps.mode}
          item={addEditProps.item}
          onSave={onSave}
          onCancel={() => setAddEditProps(null)}
        />
      )}

      {detailItem && (
        <DetailOverlay
          mode={detailItem.type}
          item={detailItem}
          onEdit={() => openEdit(detailItem)}
          onDelete={() => {
            setOptionsItem(detailItem);
            setDetailItem(null);
          }}
          onClose={() => setDetailItem(null)}
        />
      )}

      <UndoManager
        toasts={undoToasts}
        onUndo={applyUndo}
        onCancel={(id) =>
          setUndoToasts((prev) => prev.filter((t) => t.id !== id))
        }
      />

      {loading && <LoadingSpinner />}
    </div>
  );
}
