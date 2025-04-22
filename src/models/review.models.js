const pool = require("../config/db");

class Review {
  static async getReviewsByProductId(productId) {
    const result = await pool.query(
      `SELECT
        reviews.id,
        reviews.rating,
        reviews.comment,
        reviews.created_at,
        users.username AS author
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.product_id = $1
      ORDER BY reviews.created_at DESC`,
      [productId]
    );
    return result.rows;
  }

  static async addReview(userId, productId, rating, comment) {
    const result = await pool.query(
      "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, productId, rating, comment]
    );
    return result.rows[0];
  }

  // Дополнительно:
  static async getReviewById(reviewId) {
    const result = await pool.query("SELECT * FROM reviews WHERE id = $1", [
      reviewId,
    ]);
    return result.rows[0];
  }

  static async updateReview(reviewId, rating, comment) {
    const result = await pool.query(
      "UPDATE reviews SET rating = $2, comment = $3 WHERE id = $1 RETURNING *",
      [reviewId, rating, comment]
    );
    return result.rows[0];
  }

  static async deleteReview(reviewId) {
    const result = await pool.query(
      "DELETE FROM reviews WHERE id = $1 RETURNING *",
      [reviewId]
    );
    return result.rows[0];
  }
}

module.exports = Review;
