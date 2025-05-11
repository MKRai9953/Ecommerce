const express = require("express");
const {
  getAllProducts,
  createProduct,
  deleteProducts,
  getProductDetails,
  updateproduct,
} = require("../controllers/ProductControllers");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct);
router.route("/products").delete(deleteProducts);
router.route("/product/:id").get(getProductDetails).patch(updateproduct);
module.exports = router;
