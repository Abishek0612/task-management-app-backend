const { validationResult } = require("express-validator");
const Task = require("../models/Task");

// @desc    Get all tasks for the authenticated user
const getTasks = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      priority = "",
      category = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      dueDate = "",
      archived = "false",
    } = req.query;

    const filter = { user: req.user._id, isArchived: archived === "true" };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = new RegExp(category, "i");

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (dueDate) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() + 7);

      switch (dueDate) {
        case "overdue":
          filter.dueDate = { $lt: today };
          filter.status = { $ne: "completed" };
          break;
        case "today":
          filter.dueDate = {
            $gte: today.setHours(0, 0, 0, 0),
            $lt: tomorrow.setHours(0, 0, 0, 0),
          };
          break;
        case "thisWeek":
          filter.dueDate = {
            $gte: today,
            $lte: thisWeek,
          };
          break;
      }
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Task.countDocuments(filter);

    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// @desc    Create a new task
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const taskData = {
      ...req.body,
      user: req.user._id,
    };

    const task = new Task(taskData);
    await task.save();

    req.io.to(`user_${req.user._id}`).emit("task_created", task);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// @desc    Get a specific task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};

// @desc    Update a task
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.io.to(`user_${req.user._id}`).emit("task_updated", task);

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// @desc    Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.io
      .to(`user_${req.user._id}`)
      .emit("task_deleted", { id: req.params.id });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

// @desc    Add a subtask
const addSubtask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.subtasks.push({ title: req.body.title });
    await task.save();

    res.json({
      message: "Subtask added successfully",
      task,
    });
  } catch (error) {
    console.error("Add subtask error:", error);
    res.status(500).json({ message: "Server error while adding subtask" });
  }
};

// @desc    Update subtask
const updateSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const { completed } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    subtask.completed = completed;
    await task.save();

    res.json({
      message: "Subtask updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update subtask error:", error);
    res.status(500).json({ message: "Server error while updating subtask" });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
};
