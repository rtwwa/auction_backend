const express = require("express");
const cartController = require("../controllers/cart.controller.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", authenticateToken, cartController.getCart);

router.post("/", authenticateToken, cartController.addItemToCart);

router.put("/", authenticateToken, cartController.updateCartItemQuantity);

router.delete("/:productId", authenticateToken, cartController.removeCartItem);

module.exports = router;
