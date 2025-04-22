const Review = require("../models/review.models.js");

const getProductReviews = async (req, res) => {
  const productId = parseInt(req.params.productId);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Некорректный ID продукта" });
  }
  try {
    const reviews = await Review.getReviewsByProductId(productId);
    res.json(reviews);
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    res.status(500).json({ message: "Ошибка сервера при получении отзывов" });
  }
};

const addProductReview = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const productId = parseInt(req.params.productId);
  const { rating, comment } = req.body;

  if (
    isNaN(productId) ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !comment
  ) {
    return res.status(400).json({ message: "Некорректные данные отзыва" });
  }

  try {
    const newReview = await Review.addReview(
      req.user.id,
      productId,
      rating,
      comment
    );
    res.status(201).json({ message: "Отзыв добавлен", review: newReview });
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    res.status(500).json({ message: "Ошибка сервера при добавлении отзыва" });
  }
};

const updateReview = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const reviewId = parseInt(req.params.reviewId);
  const { rating, comment } = req.body;

  if (
    isNaN(reviewId) ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !comment
  ) {
    return res.status(400).json({ message: "Некорректные данные отзыва" });
  }

  try {
    const review = await Review.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Отзыв не найден" });
    }
    if (review.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Нет прав на редактирование этого отзыва" });
    }

    const updatedReview = await Review.updateReview(reviewId, rating, comment);
    res.json({ message: "Отзыв обновлен", review: updatedReview });
  } catch (error) {
    console.error("Ошибка при обновлении отзыва:", error);
    res.status(500).json({ message: "Ошибка сервера при обновлении отзыва" });
  }
};

const deleteReview = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const reviewId = parseInt(req.params.reviewId);

  if (isNaN(reviewId)) {
    return res.status(400).json({ message: "Некорректный ID отзыва" });
  }

  try {
    const review = await Review.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Отзыв не найден" });
    }
    if (review.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Нет прав на удаление этого отзыва" });
    }

    const deletedReview = await Review.deleteReview(reviewId);
    res.json({ message: "Отзыв удален", review: deletedReview });
  } catch (error) {
    console.error("Ошибка при удалении отзыва:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении отзыва" });
  }
};

module.exports = {
  getProductReviews,
  addProductReview,
  updateReview,
  deleteReview,
};
