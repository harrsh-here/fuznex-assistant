// At top with state
const [pendingDeletes, setPendingDeletes] = useState([]);
 // { id, type, itemId, label, timeout }

// Modified onDelete logic
const onDelete = async () => {
  if (!optionsItem) return;
  const { type, task_id, alarm_id, title, label } = optionsItem;
  const id = type === "tasks" ? task_id : alarm_id;

  // Temporarily remove from view
  const newItem = { ...optionsItem };
  setOptionsItem(null); // ✅ Close the overlay immediately
  setLoading(true);      // Show spinner to block misclicks

  const toastId = Date.now();
  setUndoToasts((prev) => [
    { id: toastId, type, itemId: id, title: title || label },
    ...prev.slice(0, 2),
  ]);

  // Wait 5s, if not undone → delete permanently
  setTimeout(async () => {
    const stillExists = undoToasts.find((t) => t.id === toastId);
    if (!stillExists) return; // already undone
    const route = type === "tasks" ? "todos" : "alarms";
    try {
      await api.delete(`/${route}/${id}`);
      setUndoToasts((prev) => prev.filter((t) => t.id !== toastId));
      loadAll(); // Refresh from backend
    } catch (err) {
      alert("Error deleting item");
    } finally {
      setLoading(false);
    }
  }, 5000);
};
export default TasksScreen;
