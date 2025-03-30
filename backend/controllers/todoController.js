const TodoTask = require('../models/TodoTask');
// If needed, you can later add external integration services here.
// const externalIntegration = require('../services/externalIntegration');

// Create a new task
exports.createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due_date,
      reminder,
      tags,
      recurrence,
      sort_order,
      is_archived,
      external_id
    } = req.body;
    const user_id = req.user.id;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const newTask = await TodoTask.create({
      user_id,
      title,
      description,
      priority: priority || 'low',
      due_date: due_date ? new Date(due_date) : null,
      reminder: reminder ? new Date(reminder) : null,
      is_completed: false,
      tags,
      recurrence: recurrence || 'none',
      sort_order,
      is_archived: is_archived || false,
      external_id: external_id || null
    });

    // Optionally, sync with external service:
    // if (userHasLinkedExternalAccount && !external_id) {
    //   const externalTask = await externalIntegration.syncTask(newTask);
    //   newTask.external_id = externalTask.id;
    //   await newTask.save();
    // }

    res.status(201).json({ message: 'Task created successfully.', task: newTask });
  } catch (error) {
    console.error("Error in createTodo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all tasks for the authenticated user
exports.getTodos = async (req, res) => {
  try {
    const tasks = await TodoTask.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTodos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific task by ID
exports.getTodoById = async (req, res) => {
  try {
    const task = await TodoTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.user_id !== req.user.id) return res.status(403).json({ error: "Access denied" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTodoById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a task by ID
exports.updateTodo = async (req, res) => {
  try {
    const task = await TodoTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.user_id !== req.user.id) return res.status(403).json({ error: "Access denied" });

    await task.update(req.body);

    // Optionally, sync update with external service:
    // if (task.external_id) await externalIntegration.syncTaskUpdate(task);

    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    console.error("Error in updateTodo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a task by ID
exports.deleteTodo = async (req, res) => {
  try {
    const task = await TodoTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.user_id !== req.user.id) return res.status(403).json({ error: "Access denied" });
    
    await task.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteTodo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
