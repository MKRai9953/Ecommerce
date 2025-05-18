const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../models/OrderModels/OrderModels");
const ErrorHandler = require("../utils/ErrorHandler");

// Create New Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    Itemprice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    Itemprice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({ message: "Order has been created", order });
});

// Get single Order details
exports.getOrderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) return next(new ErrorHandler("no such order exists", 404));

  res.status(200).json({ success: true, order });
});

// Get logged in users Order details

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({ success: true, orders });
});

// Get All orders for Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({ success: true, orders });
});

// delete All orders
exports.deleteAllOrder = catchAsyncError(async (req, res, next) => {
  await Order.deleteMany();

  res.status(200).json({ status: true, message: "deleted All Orders" });
});

// Update Order Status
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("There is no such order", 404));

  if (order.orderStatus === "Delivered")
    return next(new ErrorHandler("Your order has already been Delivered", 400));

  order.orderItems.forEach(
    async (order) => await updaetStock(order.product, order.quantity)
  );
  const { status } = req.body;
});
