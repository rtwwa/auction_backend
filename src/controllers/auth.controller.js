const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const user = await User.createUser(username, email, password);
    const token = User.generateToken(user);

    res.cookie("authToken", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
      path: "/",
    });

    res.json({
      message: "Успешный вход",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const token = generateToken(user);

    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 час
      path: "/",
    });

    res.json({
      message: "Успешный вход",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка при входе пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
};

const getMe = (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Не авторизован" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Недействительный токен" });
  }
};

const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Выход выполнен" });
};

module.exports = { register, login, logout, getMe };
