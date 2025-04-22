const pool = require("../config/db.js");

class CartItem {
  static async getCartItems(userId) {
    const result = await pool.query(
      `SELECT
        cart_items.id AS cart_item_id,
        cart_items.quantity,
        products.id AS product_id,
        products.title,
        products.description,
        products.price_start,
        products.buy_now_price,
        products.image_url
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  static async addItem(userId, productId, quantity = 1) {
    const checkItem = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (checkItem.rows.length > 0) {
      const updatedQuantity = checkItem.rows[0].quantity + quantity;
      const result = await pool.query(
        "UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND product_id = $2 RETURNING *",
        [userId, productId, updatedQuantity]
      );
      return result.rows[0];
    } else {
      const result = await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [userId, productId, quantity]
      );
      return result.rows[0];
    }
  }

  static async updateItemQuantity(userId, productId, quantity) {
    const result = await pool.query(
      "UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [userId, productId, quantity]
    );
    return result.rows[0];
  }

  static async removeItem(userId, productId) {
    const result = await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [userId, productId]
    );
    return result.rows[0];
  }
}

module.exports = CartItem;
