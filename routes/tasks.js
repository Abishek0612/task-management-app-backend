const express = require("express");
const auth = require("../middleware/auth");
const { taskValidation } = require("../middleware/validation");
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", auth, taskValidation.list, getTasks);
router.post("/", auth, taskValidation.create, createTask);
router.get("/stats", auth, getTaskStats);
router.get("/:id", auth, taskValidation.get, getTask);
router.put("/:id", auth, taskValidation.update, updateTask);
router.delete("/:id", auth, taskValidation.get, deleteTask);

module.exports = router;
