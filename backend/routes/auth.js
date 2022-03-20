const express = require("express");
const { route } = require("express/lib/application");

const {
  login,
  register,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controller/authController");

const { protect, adminPrivilages } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

router.route("/users").get(protect, adminPrivilages, getAllUsers);

router
  .route("/users/:id")
  .get(protect, adminPrivilages, getUserById)
  .put(protect, adminPrivilages, updateUser);

router.route("/users/delete/:id").delete(protect, adminPrivilages, deleteUser);

module.exports = router;
