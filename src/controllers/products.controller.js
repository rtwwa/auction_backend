const Product = require("../models/products.model.js");

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const products = await Product.getAllProducts(page, limit);
    const totalProducts = await Product.getTotalProductsCount();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalProducts,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении списка товаров:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении списка товаров" });
  }
};

const getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Некорректный ID продукта" });
  }
  try {
    const product = await Product.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    res.json(product);
  } catch (error) {
    console.error(`Ошибка при получении продукта с ID ${productId}:`, error);
    res.status(500).json({ message: "Ошибка сервера при получении продукта" });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
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
      image_url,
      image_url_2,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Недостаточно прав для добавления продукта" });
    }

    if (!title || !category_id) {
      return res
        .status(400)
        .json({ message: "Заголовок и ID категории обязательны" });
    }

    const newProduct = await Product.createProduct(
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
      parseInt(category_id),
      req.user.id,
      image_url,
      image_url_2
    );

    res
      .status(201)
      .json({ message: "Продукт успешно добавлен", product: newProduct });
  } catch (error) {
    console.error("Ошибка при добавлении продукта:", error);
    res.status(500).json({ message: "Ошибка сервера при добавлении продукта" });
  }
};

const findProducts = async (req, res) => {
  try {
    const query = req.query;
    const products = await Product.findProducts(query);
    res.json(products);
  } catch (error) {
    console.error("Ошибка при поиске и фильтрации продуктов:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при поиске и фильтрации продуктов" });
  }
};

const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Некорректный ID продукта" });
  }

  try {
    const deletedProduct = await Product.deleteProduct(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Продукт с таким ID не найден" });
    }
    res.json({
      message: `Продукт с ID ${productId} успешно удален`,
      product: deletedProduct,
    });
  } catch (error) {
    console.error(`Ошибка при удалении продукта с ID ${productId}:`, error);
    res.status(500).json({ message: "Ошибка сервера при удалении продукта" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  findProducts,
};
