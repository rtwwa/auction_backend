const pool = require("../config/db");

class Bid {
  static async getBidsByProductId(productId) {
    const result = await pool.query(
      `SELECT
        bids.id,
        bids.bid_amount,
        bids.created_at,
        users.username AS bidder
      FROM bids
      JOIN users ON bids.user_id = users.id
      WHERE bids.product_id = $1
      ORDER BY bids.bid_amount DESC, bids.created_at ASC`,
      [productId]
    );
    return result.rows;
  }

  static async addBid(userId, productId, bidAmount) {
    const result = await pool.query(
      "INSERT INTO bids (user_id, product_id, bid_amount) VALUES ($1, $2, $3) RETURNING *",
      [userId, productId, bidAmount]
    );
    return result.rows[0];
  }

  static async getHighestBid(productId) {
    const result = await pool.query(
      "SELECT MAX(bid_amount) AS highest_bid FROM bids WHERE product_id = $1",
      [productId]
    );
    return result.rows[0]?.highest_bid;
  }
}

module.exports = Bid;
