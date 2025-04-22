const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Обязательно храните в .env

class User {
  static async createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT id, username, email, role FROM users WHERE id = $1",
      [id]
    ); // Include role
    return result.rows[0];
  }

  static async verifyUser(token) {
    const result = await pool.query(
      "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 AND is_verified = FALSE RETURNING id, username, email",
      [token]
    );
    return result.rows[0];
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }; // Include role
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  }
}

module.exports = User;
