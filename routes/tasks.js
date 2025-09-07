const express = require("express");
const { body, query } = require("express-validator");
const auth = require("../middleware/auth");
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
} = require("../controllers/taskController");

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get(
  "/",
  auth,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("status")
      .optional()
      .isIn(["pending", "in-progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
    query("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "updatedAt", "dueDate", "title", "priority"])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  getTasks
);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  "/",
  auth,
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title is required and must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority level"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date"),
    body("estimatedTime")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Estimated time must be a positive number"),
  ],
  createTask
);

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get("/:id", auth, getTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority level"),
  ],
  updateTask
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete("/:id", auth, deleteTask);

// @route   POST /api/tasks/:id/subtasks
// @desc    Add a subtask
// @access  Private
router.post(
  "/:id/subtasks",
  auth,
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(
        "Subtask title is required and must be less than 100 characters"
      ),
  ],
  addSubtask
);

// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @desc    Update a subtask
// @access  Private
router.put(
  "/:id/subtasks/:subtaskId",
  auth,
  [
    body("completed")
      .isBoolean()
      .withMessage("Completed must be a boolean value"),
  ],
  updateSubtask
);

module.exports = router;
