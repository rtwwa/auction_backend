require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./src/routes/products.routes.js");
const authRoutes = require("./src/routes/auth.routes.js");
const cartRoutes = require("./src/routes/cart.routes.js");
const reviewRoutes = require("./src/routes/review.routes.js");
const orderRoutes = require("./src/routes/order.routes.js");
const bidRoutes = require("./src/routes/bid.routes.js");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products/:productId/bids", bidRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
