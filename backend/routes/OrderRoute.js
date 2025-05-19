const express = require("express");
const {
  newOrder,
  getOrderDetails,
  myOrders,
  getAllOrders,
  deleteAllOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/OrderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");
const OrderModels = require("../models/OrderModels/OrderModels");

const router = express.Router();

// Creating an Order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// Get an order
router.route("/order/:id").get(isAuthenticatedUser, getOrderDetails);

// Get logged In users orders
router.route("/me/orders").get(isAuthenticatedUser, myOrders);

// Admin Route get All users Orders
router
  .route("/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

//   Delete All Orders

router
  .route("/admin/deleteall")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAllOrder);

module.exports = router;

// Get all orders
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

//update Order

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(deleteOrder);
