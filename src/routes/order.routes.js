const express = require("express");
const orderController = require("../controllers/order.controller.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/checkout", authenticateToken, orderController.checkout);

router.get("/:orderId", authenticateToken, orderController.getOrderDetails);

router.get("/", authenticateToken, orderController.getUserOrdersList);

module.exports = router;
