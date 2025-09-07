const express = require("express");
const auth = require("../middleware/auth");
const { authValidation } = require("../middleware/validation");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", authValidation.register, register);
router.post("/login", authValidation.login, login);
router.post("/forgot-password", authValidation.forgotPassword, forgotPassword);
router.post("/reset-password", authValidation.resetPassword, resetPassword);
router.get("/me", auth, getCurrentUser);
router.put("/profile", auth, authValidation.updateProfile, updateProfile);
router.post("/logout", logout);

module.exports = router;
