const Task = require("../models/Task");

// @desc    Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "completed",
    });
    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      user: userId,
      status: "in-progress",
    });

    const overdueTasks = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      user: userId,
      dueDate: {
        $gte: today.setHours(0, 0, 0, 0),
        $lt: tomorrow.setHours(0, 0, 0, 0),
      },
    });

    const monthlyTasks = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: startOfMonth },
    });
    const monthlyCompleted = await Task.countDocuments({
      user: userId,
      status: "completed",
      completedAt: { $gte: startOfMonth },
    });

    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const categoryStats = await Task.aggregate([
      { $match: { user: userId, category: { $exists: true, $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const weeklyProductivity = await Task.aggregate([
      {
        $match: {
          user: userId,
          completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        tasksDueToday,
        completionRate:
          totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
        monthlyCompletionRate:
          monthlyTasks > 0
            ? ((monthlyCompleted / monthlyTasks) * 100).toFixed(1)
            : 0,
      },
      priorityStats,
      categoryStats,
      weeklyProductivity,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error while fetching analytics" });
  }
};

module.exports = {
  getDashboardAnalytics,
};
