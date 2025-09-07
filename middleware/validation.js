const { body, param, query, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

const authValidation = {
  register: [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),

    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address")
      .isLength({ max: 100 })
      .withMessage("Email must not exceed 100 characters"),

    body("password")
      .isLength({ min: 6, max: 128 })
      .withMessage("Password must be between 6 and 128 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),

    handleValidationErrors,
  ],

  login: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),

    body("password").notEmpty().withMessage("Password is required"),

    handleValidationErrors,
  ],

  forgotPassword: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),

    handleValidationErrors,
  ],

  resetPassword: [
    body("token").notEmpty().withMessage("Reset token is required"),

    body("password")
      .isLength({ min: 6, max: 128 })
      .withMessage("Password must be between 6 and 128 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),

    handleValidationErrors,
  ],

  updateProfile: [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),

    body("preferences.theme")
      .optional()
      .isIn(["light", "dark", "system"])
      .withMessage("Invalid theme preference"),

    body("preferences.notifications.email")
      .optional()
      .isBoolean()
      .withMessage("Email notification preference must be boolean"),

    body("preferences.notifications.push")
      .optional()
      .isBoolean()
      .withMessage("Push notification preference must be boolean"),

    body("preferences.taskView")
      .optional()
      .isIn(["list", "grid", "kanban"])
      .withMessage("Invalid task view preference"),

    handleValidationErrors,
  ],
};

const taskValidation = {
  create: [
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
      .withMessage("Status must be either pending or done"),

    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be low, medium, high, or urgent"),

    body("category")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Category must be less than 50 characters"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Each tag must be less than 30 characters"),

    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date"),

    handleValidationErrors,
  ],

  update: [
    param("id").isMongoId().withMessage("Invalid task ID"),

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
      .withMessage("Status must be either pending or done"),

    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be low, medium, high, or urgent"),

    body("category")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Category must be less than 50 characters"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Each tag must be less than 30 characters"),

    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date"),

    handleValidationErrors,
  ],

  get: [
    param("id").isMongoId().withMessage("Invalid task ID"),

    handleValidationErrors,
  ],

  list: [
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
      .isIn(["pending", "done"])
      .withMessage("Status must be either pending or done"),

    query("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be low, medium, high, or urgent"),

    query("sortBy")
      .optional()
      .isIn(["createdAt", "updatedAt", "title", "dueDate", "priority"])
      .withMessage("Invalid sort field"),

    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),

    query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search term must be less than 100 characters"),

    handleValidationErrors,
  ],
};

module.exports = {
  authValidation,
  taskValidation,
  handleValidationErrors,
};
