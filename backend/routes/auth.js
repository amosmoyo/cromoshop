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
  activationEmail,
  getAccessToken,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin
} = require("../controller/authController");

const { protect, adminPrivilages } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);

router.route("/activation").post(activationEmail);

router.route("/login").post(login);

router.route("/forgetpassword").post(forgotPassword);

router.route("/resetpassword").post(protect, resetPassword);

router.route("/refresh_token").post(getAccessToken);

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

router.route("/users").get(protect, adminPrivilages, getAllUsers);

router.route('/googleLogin').post(googleLogin);

router.route('/facebooklogin').post(facebookLogin)

router
  .route("/users/:id")
  .get(protect, adminPrivilages, getUserById)
  .put(protect, adminPrivilages, updateUser);

router.route("/users/delete/:id").delete(protect, adminPrivilages, deleteUser);

module.exports = router;
