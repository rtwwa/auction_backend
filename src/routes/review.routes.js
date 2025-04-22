const express = require("express");
const reviewController = require("../controllers/review.controller.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = express.Router({ mergeParams: true });

router.get("/", reviewController.getProductReviews);

router.post("/", authenticateToken, reviewController.addProductReview);

router.put("/:reviewId", authenticateToken, reviewController.updateReview);

router.delete("/:reviewId", authenticateToken, reviewController.deleteReview);

module.exports = router;
