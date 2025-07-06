// ✅ Final: Shimmer added for initial + change loads, silent refresh fully abstracted, also shimmer only per item, not whole window

import React, { useState, useEffect, useRef } from "react";
import { Plus, Clock, CaretDown, Trash } from "phosphor-react";
import api from "../../api/api";

import TaskCard from "./TaskCard";
import AlarmCard from "./AlarmCard";
import OptionsOverlay from "./OptionsOverlay";
import AddEditOverlay from "./AddEditOverlay";
import DetailOverlay from "./DetailOverlay";
import UndoManager from "./UndoManager";
import LoadingSpinner from "./LoadingSpinner";

export default function PlansScreen() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [optionsItem, setOptionsItem] = useState(null);
  const [addEditProps, setAddEditProps] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [undoToasts, setUndoToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shimmerIds, setShimmerIds] = useState([]);
  const [fadeInIds, setFadeInIds] = useState([]);
  const toastTimeouts = useRef({});

  useEffect(() => {
    loadAll();
    const interval = setInterval(() => loadAll(true), 7000);
    return () => clearInterval(interval);
  }, []);

  const loadAll = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [tasksRes, alarmsRes] = await Promise.all([
        api.get("/todos"),
        api.get("/alarms"),
      ]);
      const newTasks = sortTasks(tasksRes.data);
      const newAlarms = sortAlarms(alarmsRes.data);
      const changedIds = [
        ...getChangedIds(tasks, newTasks, "task_id"),
        ...getChangedIds(alarms, newAlarms, "alarm_id"),
      ];

      if (!isSilent && changedIds.length > 0) {
        setFadeInIds(changedIds);
        setTimeout(() => setFadeInIds([]), 800);
      }

      if (changedIds.length > 0) {
        setShimmerIds(changedIds);
        setTimeout(() => setShimmerIds([]), 1000);
      }

      setTasks(newTasks);
      setAlarms(newAlarms);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const getChangedIds = (oldList, newList, key) => {
    const mapOld = new Map(oldList.map((item) => [item[key], JSON.stringify(item)]));
    return newList
      .filter((item) => mapOld.get(item[key]) !== JSON.stringify(item))
      .map((i) => i[key]);
  };

  const onSave = () => {
    setAddEditProps(null);
    loadAll();
  };

  const onDelete = async () => {
    if (!optionsItem) return;
    const { type, task_id, alarm_id, title, label } = optionsItem;
    const id = type === "tasks" ? task_id : alarm_id;
    const route = type === "tasks" ? "todos" : "alarms";
    const toastId = Date.now();

    setOptionsItem(null);
    setUndoToasts((prev) => [
      { id: toastId, type, itemId: id, title: title || label },
      ...prev.slice(0, 2),
    ]);

    toastTimeouts.current[toastId] = setTimeout(async () => {
      try {
        await api.delete(`/${route}/${id}`);
      } catch (err) {
        alert("Error deleting item");
      } finally {
        delete toastTimeouts.current[toastId];
        setUndoToasts((prev) => prev.filter((t) => t.id !== toastId));
        loadAll();
      }
    }, 3000);
  };

  const applyUndo = (toast) => {
    clearTimeout(toastTimeouts.current[toast.id]);
    delete toastTimeouts.current[toast.id];
    setUndoToasts((prev) => prev.filter((t) => t.id !== toast.id));
    loadAll();
  };

 const onCancelUndo = async (id) => {
  const pending = pendingDeletions.current[id];
  if (!pending) return;

  // Clear scheduled deletion
  if (toastTimeouts.current[id]) {
    clearTimeout(toastTimeouts.current[id]);
    delete toastTimeouts.current[id];
  }

  try {
    // Immediate delete
    await api.delete(`/${pending.route}/${pending.id}`);
  } catch (err) {
    console.error("Error force-deleting item:", err);
    alert("Failed to delete item.");
    return;
  }

  // Remove from deletion tracking + toast
  delete pendingDeletions.current[id];
  setUndoToasts((prev) => prev.filter((t) => t.id !== id));

  // Refresh data
  loadAll();
};

  const onToggleComplete = async (task) => {
    try {
      await api.put(`/todos/${task.task_id}`, {
        is_completed: !task.is_completed,
        completed_at: !task.is_completed ? new Date() : null,
      });
      loadAll();
    } catch {
      alert("Failed to toggle completion");
    }
  };

  const deleteSelected = async () => {
    const isTask = activeTab === "tasks";
    const route = isTask ? "todos" : "alarms";
    try {
      await Promise.all(selectedItems.map((id) => api.delete(`/${route}/${id}`)));
      cancelSelection();
      loadAll();
    } catch {
      alert("Error deleting selected items");
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const cancelSelection = () => {
    setSelectedItems([]);
    setSelectionMode(false);
  };

  const openEdit = (item) => {
    setAddEditProps({ mode: activeTab, item });
    setOptionsItem(null);
    setDetailItem(null);
  };

  const openAdd = () => setAddEditProps({ mode: activeTab, item: null });

  const sortTasks = (items) => {
    const now = new Date();
    const dueToday = [], upcoming = [], overdue = [], noDueDate = [], completed = [];
    items.forEach((task) => {
      const due = task.due_date ? new Date(task.due_date) : null;
      if (task.is_completed) completed.push(task);
      else if (!due) noDueDate.push(task);
      else if (due.toDateString() === now.toDateString()) dueToday.push(task);
      else if (due > now) upcoming.push(task);
      else overdue.push(task);
    });
    dueToday.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    overdue.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    noDueDate.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    completed.sort((a, b) => new Date(b.completed_at || 0) - new Date(a.completed_at || 0));
    return [...dueToday, ...upcoming, ...overdue, ...noDueDate, ...completed];
  };

  const sortAlarms = (items) => {
    const active = items.filter((a) => a.is_active).sort((a, b) => new Date(a.alarm_time) - new Date(b.alarm_time));
    const inactive = items.filter((a) => !a.is_active).sort((a, b) => new Date(b.alarm_time) - new Date(a.alarm_time));
    return [...active, ...inactive];
  };

  const visibleTasks = priorityFilter === "all" ? tasks : tasks.filter((t) => t.priority === priorityFilter);
  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "High Priority", value: "high" },
    { label: "Medium Priority", value: "medium" },
    { label: "Low Priority", value: "low" },
  ];

  const renderCards = () => {
    const list = activeTab === "tasks" ? visibleTasks : alarms;
    const Card = activeTab === "tasks" ? TaskCard : AlarmCard;
    const idKey = activeTab === "tasks" ? "task_id" : "alarm_id";

    if (loading && list.length === 0) {
      return [...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-[72px] rounded-xl bg-[#1e1e1e] border border-[#2a2a2a]"
        >
          <div className="p-4 space-y-2">
            <div className="w-1/2 h-3 bg-gray-700 rounded" />
            <div className="w-1/3 h-2 bg-gray-800 rounded" />
          </div>
        </div>
      ));
    }

    return list.map((item) => (
      <div
        key={item[idKey]}
        className={`${
          shimmerIds.includes(item[idKey])
            ? "animate-pulse"
            : fadeInIds.includes(item[idKey])
            ? "animate-fadeIn"
            : ""
        }`}
      >
        <Card
          {...{ [activeTab.slice(0, -1)]: item }}
          onOptions={() => setOptionsItem({ ...item, type: activeTab })}
          onEdit={() => openEdit(item)}
          onOpenDetail={() => setDetailItem({ ...item, type: activeTab })}
          onToggleComplete={activeTab === "tasks" ? onToggleComplete : undefined}
          selectionMode={selectionMode}
          selected={selectedItems.includes(item[idKey])}
          onSelect={() => toggleSelect(item[idKey])}
        />
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden relative">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks & Alarms</h2>

      {/* Tab Switcher */}
      <div className="flex mb-4 gap-4">
        {["tasks", "alarms"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              cancelSelection();
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab ? "bg-purple-600 text-white" : "bg-[#1e1e1e] text-gray-400"
            }`}
          >
            {tab === "tasks" ? "Tasks" : <><Clock className="inline w-4 h-4 mr-1 align-text-bottom" /> Alarms</>}
          </button>
        ))}
      </div>

      {/* Filters / Add / Delete Selection */}
      <div className="flex items-center justify-between mb-3 gap-3 relative">
        {activeTab === "tasks" && !selectionMode && (
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className="flex items-center gap-1 bg-[#1e1e1e] border border-gray-700 text-sm text-gray-300 px-3 py-2 rounded-lg hover:border-purple-500"
            >
              Priority: {priorityOptions.find((opt) => opt.value === priorityFilter)?.label}
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
                      option.value === priorityFilter ? "text-purple-400" : "text-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectionMode ? (
          <>
            <button onClick={deleteSelected} className="ml-auto p-2 bg-red-600 rounded-full hover:bg-red-700">
              <Trash size={20} />
            </button>
            <button onClick={cancelSelection} className="p-2 text-sm text-gray-400 hover:text-white">Cancel</button>
          </>
        ) : (
          <button
            onClick={openAdd}
            className="ml-auto p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20">{renderCards()}</div>

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

      <UndoManager toasts={undoToasts} onUndo={applyUndo} onCancel={onCancelUndo} />
    </div>
  );
}
