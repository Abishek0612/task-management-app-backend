const express = require("express");
const auth = require("../middleware/auth");
const { getDashboardAnalytics } = require("../controllers/analyticsController");

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get("/dashboard", auth, getDashboardAnalytics);

module.exports = router;
