const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller.js");
const authenticateToken = require("../middleware/auth.middleware.js");
const isAdmin = require("../middleware/admin.middleware.js");

router.get("/", productsController.getAllProducts);
router.get("/search", productsController.findProducts);
router.get("/:id", productsController.getProductById);
router.post("/", authenticateToken, isAdmin, productsController.addProduct);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  productsController.deleteProduct
);

module.exports = router;
