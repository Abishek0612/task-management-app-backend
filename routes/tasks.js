const express = require("express");
const { body, query } = require("express-validator");
const auth = require("../middleware/auth");
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const router = express.Router();

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
      .isIn(["all", "pending", "done"])
      .withMessage("Invalid status"),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "updatedAt", "title"])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  getTasks
);

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
    body("status")
      .optional()
      .isIn(["pending", "done"])
      .withMessage("Invalid status"),
  ],
  createTask
);

router.get("/stats", auth, getTaskStats);

router.get("/:id", auth, getTask);

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
      .isIn(["pending", "done"])
      .withMessage("Invalid status"),
  ],
  updateTask
);

router.delete("/:id", auth, deleteTask);

module.exports = router;
