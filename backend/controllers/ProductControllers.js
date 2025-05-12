const Product = require("../models/product_models/ProductModels");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsync = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/ApiFeatures");

// Get all products
exports.getAllProducts = catchAsync(async (req, res) => {
  const resultPage = 5;
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPage);
    
  const products = await apiFeature.query;

  res.status(200).json({ success: true, products: products });
});

// Create a new product
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product: product });
});

// delete a product
exports.deleteProducts = catchAsync(async (_, res, next) => {
  await Product.deleteMany();
  res.status(200).json({ success: true, message: "Products deleted" });
});

// Get a product detail
exports.getProductDetails = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({ success: true, product: product });
});

// Delete a product
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "Product deleted" });
});

// Update a product
exports.updateproduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("product not found", 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, product: product });
});
