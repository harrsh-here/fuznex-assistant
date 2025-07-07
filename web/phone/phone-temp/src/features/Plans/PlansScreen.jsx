// PlansScreen.jsx

import React, { useState, useEffect, useRef } from "react";
import { Plus, Clock, CaretDown, Trash, CheckCircle, ListChecks } from "phosphor-react";
import api from "../../api/api";

import TaskCard from "./TaskCard";
import AlarmCard from "./AlarmCard";
import OptionsOverlay from "./OptionsOverlay";
import AddEditOverlay from "./AddEditOverlay";
import DetailOverlay from "./DetailOverlay";
import UndoManager from "./UndoManager";
import LoadingSpinner from "./LoadingSpinner";
import { logHistory } from "../../utils/logHistory";



export default function PlansScreen() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showDueMenu, setShowDueMenu] = useState(false);
  const [optionsItem, setOptionsItem] = useState(null);
  const [addEditProps, setAddEditProps] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [undoToasts, setUndoToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shimmerIds, setShimmerIds] = useState([]);
  const [fadeInIds, setFadeInIds] = useState([]);
  const [showToastMsg, setShowToastMsg] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const toastTimeouts = useRef({});
  const pendingDeletions = useRef({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const refreshInterval = useRef(null);

  // INITIAL & AUTO LOAD
  useEffect(() => {
    loadAll();
    refreshInterval.current = setInterval(() => loadAll(true), 5000);
    return () => clearInterval(refreshInterval.current);
  }, []);

  

  const loadAll = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [tasksRes, alarmsRes] = await Promise.all([
        api.get("/todos"),
        api.get("/alarms"),
      ]);
        const newTasks = sortTasks(tasksRes.data);
      const newAlarms = sortAlarms(alarmsRes.data);
      const newIds = [
        ...getNewIds(tasks, newTasks, "task_id"),
        ...getNewIds(alarms, newAlarms, "alarm_id"),
      ];
      if (!silent && newIds.length > 0) {
        setFadeInIds(newIds);
        setTimeout(() => setFadeInIds([]), 2000);
      }
      setTasks(newTasks);
      setAlarms(newAlarms);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getNewIds = (oldList, newList, key) => {
    const oldIds = new Set(oldList.map((i) => i[key]));
    return newList.filter((item) => !oldIds.has(item[key])).map((i) => i[key]);
  };

  const showToast = (message) => {
    setShowToastMsg(message);
    setTimeout(() => setShowToastMsg(null), 2200);
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const cancelSelection = () => {
    setSelectedItems([]);
    setSelectionMode(false);
  };

  const confirmDeleteSelected = () => {
  if (selectedItems.length > 0) {
    setShowDeleteConfirm(true); // Show modal
  }
};
   
 const handleConfirmedBatchDelete = async () => {
  setShowDeleteConfirm(false); // Close modal
  

  const isTask = activeTab === "tasks";
  const route = isTask ? "todos" : "alarms";
  const toastId = Date.now();

  setUndoToasts((prev) => [
    { id: toastId, type: activeTab, itemId: [...selectedItems], title: `Multiple ${activeTab}` },
    ...prev.slice(0, 2),
  ]);

  // Optional: store route/id for bulk undo
  pendingDeletions.current[toastId] = {
    route,
    ids: [...selectedItems],
  };

  toastTimeouts.current[toastId] = setTimeout(async () => {
    try {
      await Promise.all(selectedItems.map((id) => api.delete(`/${route}/${id}`)));
      showToast("Deleted selected items");
    } catch {
      alert("Error deleting selected items");
    } finally {
      cancelSelection();
      delete toastTimeouts.current[toastId];
      setUndoToasts((prev) => prev.filter((t) => t.id !== toastId));
      loadAll();
    }
  }, 3000);
};


  const visibleTasks = tasks.filter((t) => {
    const todayStr = new Date().toDateString();
    const due = t.due_date ? new Date(t.due_date) : null;

    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (dueFilter === "today" && (!due || due.toDateString() !== todayStr)) return false;
    if (dueFilter === "overdue" && (!due || due >= new Date())) return false;
    if (dueFilter === "none" && due) return false;
    if (dueFilter === "other" && (!due || due <= new Date() || due.toDateString() === todayStr)) return false;

    return true;
  });

  const onSave = () => {
    setAddEditProps(null);
    loadAll();
    showToast("Saved successfully");
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

  pendingDeletions.current[toastId] = {
    route,
    ids: id,
  };

  toastTimeouts.current[toastId] = setTimeout(async () => {
    try {
      await api.delete(`/${route}/${id}`);
      showToast("Deleted");
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
   delete pendingDeletions.current[toast.id]; // ← ADD this
  setUndoToasts((prev) => prev.filter((t) => t.id !== toast.id));
  cancelSelection();
  loadAll();
  showToast("Restored");
};

  const onCancelUndo = async (id) => {
  const pending = pendingDeletions.current[id];
  if (!pending) return;

  // Cancel the delayed deletion timeout
  if (toastTimeouts.current[id]) {
    clearTimeout(toastTimeouts.current[id]);
    delete toastTimeouts.current[id];
  }

  try {
    // Now perform the actual deletion immediately
    if (Array.isArray(pending.ids)) {
      await Promise.all(pending.ids.map((i) => api.delete(`/${pending.route}/${i}`)));
    } else {
      await api.delete(`/${pending.route}/${pending.ids}`);
    }

    showToast("Deleted");
  } catch {
    alert("Force delete failed.");
  }

  delete pendingDeletions.current[id];
  setUndoToasts((prev) => prev.filter((t) => t.id !== id));
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

  const openEdit = (item) => {
    if (!selectionMode) {
      setAddEditProps({ mode: activeTab, item });
      setOptionsItem(null);
      setDetailItem(null);
    }
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
    return [...dueToday, ...upcoming, ...overdue, ...noDueDate, ...completed];
  };

  const sortAlarms = (items) => {
    const active = items.filter((a) => a.is_active).sort((a, b) => new Date(a.alarm_time) - new Date(b.alarm_time));
    const inactive = items.filter((a) => !a.is_active).sort((a, b) => new Date(b.alarm_time) - new Date(a.alarm_time));
    return [...active, ...inactive];
  };
  
  const priorityOptions = [
    { label: "All", value: "all" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  const dueOptions = [
    { label: "All", value: "all" },
    { label: "Due Today", value: "today" },
    { label: "Overdue", value: "overdue" },
    { label: "No Due Date", value: "none" },
    { label: "Other Days", value: "other" },
  ];

  const renderCards = () => {
    const list = activeTab === "tasks" ? visibleTasks : alarms;
    const Card = activeTab === "tasks" ? TaskCard : AlarmCard;
    const idKey = activeTab === "tasks" ? "task_id" : "alarm_id";

    if (loading && list.length === 0) {
      return [...Array(3)].map((_, i) => (
        <div key={i} className="h-[72px] rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 space-y-2">
          <div className="w-1/2 h-3 bg-gray-700 rounded" />
          <div className="w-1/3 h-2 bg-gray-800 rounded" />
        </div>
      ));
    }

    return list.map((item) => (
      <div
        key={item[idKey]}
        className={`${fadeInIds.includes(item[idKey]) ? "animate-fadeIn" : ""}`}
      >
        <Card
          {...{ [activeTab.slice(0, -1)]: item }}
          onOptions={() => setOptionsItem({ ...item, type: activeTab })}
          onEdit={() => openEdit(item)}
          onOpenDetail={() =>
            !selectionMode && setDetailItem({ ...item, type: activeTab })
          }
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
            {tab === "tasks" ? "Tasks" : <><Clock className="inline w-4 h-4 mr-1" /> Alarms</>}
          </button>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className="bg-[#1e1e1e] border border-gray-700 text-sm px-3 py-2 rounded-lg text-gray-300"
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
          >
            Priority: {priorityFilter}
          </button>
          {showPriorityMenu && (
            <div className="absolute mt-10 z-10 bg-[#1e1e1e] border border-gray-700 rounded-xl shadow">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPriorityFilter(opt.value);
                    setShowPriorityMenu(false);
                  }}
                  className="block px-4 py-2 text-sm text-white hover:bg-purple-700 w-full text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <button
            className="bg-[#1e1e1e] border border-gray-700 text-sm px-3 py-2 rounded-lg text-gray-300"
            onClick={() => setShowDueMenu(!showDueMenu)}
          >
            Due: {dueFilter}
          </button>
          {showDueMenu && (
            <div className="absolute mt-10 ml-32 z-10 bg-[#1e1e1e] border border-gray-700 rounded-xl shadow">
              {dueOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setDueFilter(opt.value);
                    setShowDueMenu(false);
                  }}
                  className="block px-4 py-2 text-sm text-white hover:bg-purple-700 w-full text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          
          <button
           onClick={() => {
                      setSelectionMode((prev) => {
               if (prev) setSelectedItems([]); // ← Clear selected items when turning off
                         return !prev;
                    });
                            }}
            className="p-2 bg-yellow-600 rounded-full hover:bg-yellow-700"
            title="Select Multiple"
          >
            <ListChecks size={20} />
          </button>
        {selectionMode ? (
  <button
    onClick={confirmDeleteSelected}
    className="p-2 bg-red-600 rounded-full hover:bg-red-700"
    title="Delete Selected"
  >
    <Trash size={20} />
  </button>
) : (
  <button
    onClick={openAdd}
    className="p-2 bg-purple-600 rounded-full hover:bg-purple-700"
    title="Add New"
  >
    <Plus size={20} />
  </button>
)}
        </div>
      </div>

      {/* Toast */}
   {showToastMsg && (
  <div
    className="fixed left-1/2 transform -translate-x-1/2 bg-[#1e1e1e] border border-purple-700 text-white px-4 py-2 rounded-lg shadow z-50 flex items-center gap-2 text-sm font-medium max-w-[90%] sm:max-w-[300px]"
    style={{ bottom: "9.5rem" }} // ⬅️ Fine-tuned spacing
  >
    <CheckCircle size={16} className="text-green-500" />
    <span>{showToastMsg}</span>
  </div>
)}





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
          {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
   <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-5 w-[85%] max-w-[320px] text-center shadow-lg">

      <p className="text-white mb-4">
        Are you sure you want to delete {selectedItems.length} selected {activeTab}?
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={handleConfirmedBatchDelete}
        >
          Yes, Delete
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          onClick={() => setShowDeleteConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <UndoManager toasts={undoToasts} onUndo={applyUndo} onCancel={onCancelUndo} />
       {loading && <LoadingSpinner />}
    </div>
  );
}
