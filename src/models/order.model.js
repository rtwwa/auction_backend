const pool = require("../config/db.js");

class Order {
  static async createOrder(userId) {
    const result = await pool.query(
      "INSERT INTO orders (user_id, status) VALUES ($1, 'pending') RETURNING id, created_at",
      [userId]
    );
    return result.rows[0];
  }

  static async addOrderItem(orderId, productId, quantity, price) {
    const result = await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [orderId, productId, quantity, price]
    );
    return result.rows[0];
  }

  static async getOrderById(orderId, userId) {
    const result = await pool.query(
      `SELECT
        orders.id AS order_id,
        orders.status,
        orders.created_at,
        order_items.product_id,
        order_items.quantity,
        order_items.price,
        products.title,
        products.image_url
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      JOIN products ON order_items.product_id = products.id
      WHERE orders.id = $1 AND orders.user_id = $2`,
      [orderId, userId]
    );
    return result.rows;
  }

  static async getUserOrders(userId) {
    const result = await pool.query(
      `SELECT
        orders.id AS order_id,
        orders.status,
        orders.created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY orders.created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Order;
