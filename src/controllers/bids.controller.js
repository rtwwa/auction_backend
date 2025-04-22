const Bid = require("../models/bids.model.js");
const Product = require("../models/products.model.js");

const getProductBids = async (req, res) => {
  const productId = parseInt(req.params.productId);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Некорректный ID продукта" });
  }
  try {
    const bids = await Bid.getBidsByProductId(productId);
    res.json(bids);
  } catch (error) {
    console.error("Ошибка при получении ставок:", error);
    res.status(500).json({ message: "Ошибка сервера при получении ставок" });
  }
};

const addProductBid = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const productId = parseInt(req.params.productId);
  const { bidAmount } = req.body;

  if (
    isNaN(productId) ||
    isNaN(parseFloat(bidAmount)) ||
    parseFloat(bidAmount) <= 0
  ) {
    return res.status(400).json({ message: "Некорректная сумма ставки" });
  }

  try {
    const product = await Product.getProductById(productId); // Получаем информацию о товаре
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    const highestBid = await Bid.getHighestBid(productId);
    if (
      highestBid !== null &&
      parseFloat(bidAmount) <= parseFloat(highestBid)
    ) {
      return res.status(400).json({
        message: `Ваша ставка должна быть выше текущей максимальной ставки: ${highestBid}`,
      });
    }
    if (parseFloat(bidAmount) <= product.price_start) {
      return res.status(400).json({
        message: `Ваша ставка должна быть выше начальной цены: ${product.price_start}`,
      });
    }

    const newBid = await Bid.addBid(
      req.user.id,
      productId,
      parseFloat(bidAmount)
    );
    res.status(201).json({ message: "Ставка добавлена", bid: newBid });
  } catch (error) {
    console.error("Ошибка при добавлении ставки:", error);
    res.status(500).json({ message: "Ошибка сервера при добавлении ставки" });
  }
};

module.exports = { getProductBids, addProductBid };
