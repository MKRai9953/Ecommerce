const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  getAllProducts,
  createProduct,
  deleteProducts,
  getProductDetails,
  updateproduct,
} = require("../controllers/ProductControllers");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
  .route("/products")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducts);
router.route("/product/:id").get(getProductDetails).patch(updateproduct);

module.exports = router;
