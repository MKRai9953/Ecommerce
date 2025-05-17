const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getUserCount,
  getSingleUserDetail,
  deleteAUser,
  changeUserRole,
} = require("../controllers/UserController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/update/password").put(isAuthenticatedUser, updateUserPassword);
router.route("/update/user").put(isAuthenticatedUser, updateUserProfile);
router
  .route("/users/count")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserCount);

router
  .route("/delete/user/:userId")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAUser);

router
  .route("/user/role/:userId")
  .put(isAuthenticatedUser, authorizeRoles("admin"), changeUserRole);

module.exports = router;
