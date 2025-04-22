const CartItem = require("../models/cartItems.model.js");

const getCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const cartItems = await CartItem.getCartItems(req.user.id);
    res.json(cartItems);
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    res.status(500).json({ message: "Ошибка сервера при получении корзины" });
  }
};

const addItemToCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const { productId, quantity } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "ID продукта обязателен" });
  }
  try {
    const cartItem = await CartItem.addItem(
      req.user.id,
      parseInt(productId),
      parseInt(quantity)
    );
    res.status(201).json({ message: "Товар добавлен в корзину", cartItem });
  } catch (error) {
    console.error("Ошибка при добавлении товара в корзину:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при добавлении товара в корзину" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const { productId, quantity } = req.body;
  if (!productId || !quantity || parseInt(quantity) < 1) {
    return res
      .status(400)
      .json({
        message:
          "ID продукта и количество обязательны, количество должно быть больше 0",
      });
  }
  try {
    const updatedItem = await CartItem.updateItemQuantity(
      req.user.id,
      parseInt(productId),
      parseInt(quantity)
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Товар не найден в корзине" });
    }
    res.json({
      message: "Количество товара в корзине обновлено",
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error("Ошибка при обновлении количества товара в корзине:", error);
    res
      .status(500)
      .json({
        message: "Ошибка сервера при обновлении количества товара в корзине",
      });
  }
};

const removeCartItem = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const productId = parseInt(req.params.productId);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Некорректный ID продукта" });
  }
  try {
    const removedItem = await CartItem.removeItem(req.user.id, productId);
    if (!removedItem) {
      return res.status(404).json({ message: "Товар не найден в корзине" });
    }
    res.json({ message: "Товар удален из корзины", cartItem: removedItem });
  } catch (error) {
    console.error("Ошибка при удалении товара из корзины:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при удалении товара из корзины" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
};
