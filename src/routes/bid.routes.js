const express = require("express");
const bidController = require("../controllers/bids.controller.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = express.Router({ mergeParams: true });

router.get("/", bidController.getProductBids);

router.post("/", authenticateToken, bidController.addProductBid);

module.exports = router;
