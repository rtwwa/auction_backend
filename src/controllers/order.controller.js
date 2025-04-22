const Order = require("../models/order.model.js");
const CartItem = require("../models/cartItems.model.js");

const checkout = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  try {
    const cartItems = await CartItem.getCartItems(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Корзина пуста" });
    }

    // 1. Создаем новый заказ
    const order = await Order.createOrder(req.user.id);
    const orderId = order.id;

    let totalAmount = 0;

    // 2. Добавляем товары из корзины в заказ
    for (const item of cartItems) {
      await Order.addOrderItem(
        orderId,
        item.product_id,
        item.quantity,
        item.buy_now_price
      );
      totalAmount += item.buy_now_price * item.quantity;
    }

    // 3. Очищаем корзину пользователя
    for (const item of cartItems) {
      await CartItem.removeItem(req.user.id, item.product_id);
    }

    res
      .status(201)
      .json({ message: "Заказ успешно оформлен", orderId, totalAmount });
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    res.status(500).json({ message: "Ошибка сервера при оформлении заказа" });
  }
};

const getOrderDetails = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const orderId = parseInt(req.params.orderId);
  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Некорректный ID заказа" });
  }

  try {
    const orderDetails = await Order.getOrderById(orderId, req.user.id);
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ message: "Заказ не найден" });
    }
    // Форматируем ответ, если getOrderById возвращает несколько строк (товары в заказе)
    const formattedOrder = {
      order_id: orderDetails[0].order_id,
      status: orderDetails[0].status,
      created_at: orderDetails[0].created_at,
      items: orderDetails.map((item) => ({
        product_id: item.product_id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
      })),
    };
    res.json(formattedOrder);
  } catch (error) {
    console.error("Ошибка при получении деталей заказа:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении деталей заказа" });
  }
};

const getUserOrdersList = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  try {
    const orders = await Order.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error("Ошибка при получении списка заказов пользователя:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении списка заказов" });
  }
};

module.exports = { checkout, getOrderDetails, getUserOrdersList };
