const { validationResult } = require("express-validator");
const Task = require("../models/Task");

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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { user: req.user._id };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
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

    res.json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

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

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

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

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "done",
    });
    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: "pending",
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate:
        totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
