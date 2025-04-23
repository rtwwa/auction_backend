const pool = require("../config/db");

class Product {
  static async getAllProducts(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT * FROM products LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async getTotalProductsCount() {
    const result = await pool.query("SELECT COUNT(*) FROM products");
    return parseInt(result.rows[0].count);
  }

  static async getProductById(id) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async createProduct(
    title,
    description,
    brand,
    color,
    size,
    material,
    season,
    gender,
    price_start,
    buy_now_price,
    category_id,
    user_id,
    image_url,
    image_url2
  ) {
    const result = await pool.query(
      "INSERT INTO products (title, description, brand, color, size, material, season, gender, price_start, buy_now_price, category_id, image_url, image_url2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,) RETURNING *",
      [
        title,
        description,
        brand,
        color,
        size,
        material,
        season,
        gender,
        price_start,
        buy_now_price,
        category_id,
        user_id,
        image_url,
        image_url2,
      ]
    );
    return result.rows[0];
  }

  static async findProducts(filters, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let sql = "SELECT * FROM products WHERE 1=1";
    const values = [];
    let paramCount = 1;

    if (filters.title) {
      sql += ` AND title ILIKE $${paramCount++}`;
      values.push(`%${filters.title}%`);
    }
    if (filters.category_id) {
      sql += ` AND category_id = $${paramCount++}`;
      values.push(parseInt(filters.category_id));
    }
    if (filters.price_start_min) {
      sql += ` AND price_start >= $${paramCount++}`;
      values.push(parseFloat(filters.price_start_min));
    }
    if (filters.price_start_max) {
      sql += ` AND price_start <= $${paramCount++}`;
      values.push(parseFloat(filters.price_start_max));
    }
    if (filters.brand) {
      sql += ` AND brand ILIKE $${paramCount++}`;
      values.push(`%${filters.brand}%`);
    }
    if (filters.color) {
      sql += ` AND color ILIKE $${paramCount++}`;
      values.push(`%${filters.color}%`);
    }
    if (filters.size) {
      sql += ` AND size ILIKE $${paramCount++}`;
      values.push(`%${filters.size}%`);
    }
    if (filters.material) {
      sql += ` AND material ILIKE $${paramCount++}`;
      values.push(`%${filters.material}%`);
    }
    if (filters.season) {
      sql += ` AND season ILIKE $${paramCount++}`;
      values.push(`%${filters.season}%`);
    }
    if (filters.gender) {
      sql += ` AND gender = $${paramCount++}`;
      values.push(filters.gender);
    }

    sql += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(limit, offset);

    const result = await pool.query(sql, values);
    return result.rows;
  }

  static async deleteProduct(id) {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Product;
