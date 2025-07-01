import React, { useState, useEffect, useRef } from "react";
import { Plus, Clock, CaretDown } from "phosphor-react";
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
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [optionsItem, setOptionsItem] = useState(null);
  const [addEditProps, setAddEditProps] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [undoToasts, setUndoToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const toastTimeouts = useRef({});

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [tasksRes, alarmsRes] = await Promise.all([
        api.get("/todos"),
        api.get("/alarms"),
      ]);
      setTasks(sortTasks(tasksRes.data));
      setAlarms(sortAlarms(alarmsRes.data));
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
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
    const toastId = Date.now();
    const route = type === "tasks" ? "todos" : "alarms";

    setOptionsItem(null);
    setLoading(true);

    const toast = { id: toastId, type, itemId: id, title: title || label };
    setUndoToasts((prev) => [toast, ...prev.slice(0, 2)]);

    toastTimeouts.current[toastId] = setTimeout(async () => {
      try {
        await api.delete(`/${route}/${id}`);
      } catch (err) {
        alert("Error deleting item");
      } finally {
        setUndoToasts((prev) => prev.filter((t) => t.id !== toastId));
        delete toastTimeouts.current[toastId];
        setLoading(false);
        loadAll();
      }
    }, 5000);
  };

  const applyUndo = (toast) => {
    clearTimeout(toastTimeouts.current[toast.id]);
    delete toastTimeouts.current[toast.id];
    setUndoToasts((prev) => prev.filter((t) => t.id !== toast.id));
    setLoading(false);
  };

  const onCancelUndo = (id) => {
    clearTimeout(toastTimeouts.current[id]);
    delete toastTimeouts.current[id];
    setUndoToasts((prev) => prev.filter((t) => t.id !== id));
    setLoading(false);
  };

  const onToggleComplete = async (task) => {
    const updatedTask = {
      ...task,
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date() : null,
    };

    setTasks((prev) =>
      prev.map((t) => (t.task_id === task.task_id ? updatedTask : t))
    );

    try {
      await api.put(`/todos/${task.task_id}`, {
        is_completed: updatedTask.is_completed,
        completed_at: updatedTask.completed_at,
      });
      loadAll();
    } catch (err) {
      alert("Failed to update task status");
      console.error(err);
    }
  };

  const visibleTasks =
    priorityFilter === "all"
      ? tasks
      : tasks.filter((t) => t.priority === priorityFilter);

  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "High Priority", value: "high" },
    { label: "Medium Priority", value: "medium" },
    { label: "Low Priority", value: "low" },
  ];

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
      <div className="flex items-center justify-between mb-3 gap-3 relative">
        {activeTab === "tasks" && (
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className="flex items-center gap-1 bg-[#1e1e1e] border border-gray-700 text-sm text-gray-300 px-3 py-2 rounded-lg hover:border-purple-500"
            >
              Priority:{" "}
              {
                priorityOptions.find((opt) => opt.value === priorityFilter)
                  ?.label
              }
              <CaretDown size={14} />
            </button>

            {showPriorityMenu && (
              <div className="absolute z-40 mt-2 w-48 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-lg overflow-hidden">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPriorityFilter(option.value);
                      setShowPriorityMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-600 hover:text-white transition ${
                      option.value === priorityFilter
                        ? "text-purple-400"
                        : "text-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
        {loading ? (
          [...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-[72px] rounded-xl bg-[#1e1e1e] animate-pulse border border-[#2a2a2a]"
            >
              <div className="p-4 space-y-2">
                <div className="w-1/2 h-3 bg-gray-700 rounded" />
                <div className="w-1/3 h-2 bg-gray-800 rounded" />
              </div>
            </div>
          ))
        ) : activeTab === "tasks" ? (
          visibleTasks.map((t) => (
            <TaskCard
              key={t.task_id}
              task={t}
              onOptions={() => setOptionsItem({ ...t, type: "tasks" })}
              onEdit={() => openEdit(t)}
              onOpenDetail={() => setDetailItem({ ...t, type: "tasks" })}
              onToggleComplete={onToggleComplete}
            />
          ))
        ) : (
          alarms.map((a) => (
            <AlarmCard
              key={a.alarm_id}
              alarm={a}
              onOptions={() => setOptionsItem({ ...a, type: "alarms" })}
              onEdit={() => openEdit(a)}
              onOpenDetail={() => setDetailItem({ ...a, type: "alarms" })}
            />
          ))
        )}
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
        onCancel={onCancelUndo}
      />

      {loading && <LoadingSpinner />}
    </div>
  );
}
