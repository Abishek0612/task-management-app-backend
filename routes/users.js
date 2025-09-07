const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put("/preferences", auth, async (req, res) => {
  try {
    const { theme, notifications, taskView } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "preferences.theme": theme,
          "preferences.notifications": notifications,
          "preferences.taskView": taskView,
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Preferences updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating preferences" });
  }
});

module.exports = router;
