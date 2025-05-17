const Product = require("../models/product_models/ProductModels");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsync = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/ApiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");

// Get all products
exports.getAllProducts = catchAsync(async (req, res) => {
  const resultPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPage);

  const products = await apiFeature.query;

  res
    .status(200)
    .json({ success: true, products: products, totalProducts: productCount });
});

// Create a new product
exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
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

// Create New review and update the review
exports.createProductReview = catchAsync(async (req, res, next) => {
  const { user, rating, comment, productId } = req.body;
  const review = {
    user: user._id,
    name: req.body.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new Error("This product does not exists", 404));
  }

  const isReviewed = await product.reviews.find(
    (rev) => rev.user.toString() === user._id.toString()
  );

  if (isReviewed) {
    product.review.forEach((rev) => {
      if (rev.user.toString() === user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.lenght;
  }

  let avg = 0;

  product.reviews.forEach((rev) => (avg += rev.rating));

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

// Get ALl reviews

exports.getAllProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error("No product found", 404));
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});

// Delete a review

exports.deleteAReview = catchAsyncError(async (req, res, next) => {
  const product = Product.findById(req.params.productId);

  if (!product) {
    return next(new Error("No product found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => (avg += rev.rating));

  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;
  await product.findByIdAndUpdate(
    req.params.productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true });
});
