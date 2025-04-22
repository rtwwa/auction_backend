CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user',
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100),
  color VARCHAR(50),
  size VARCHAR(50),
  material VARCHAR(100),
  season VARCHAR(50),
  gender VARCHAR(50),
  price_start NUMERIC(10, 2),
  buy_now_price NUMERIC(10, 2),
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_url TEXT,
  image_url_2 TEXT
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  price NUMERIC(10, 2)
);

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  bid_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_brand ON products (brand);
CREATE INDEX idx_products_color ON products (color);
CREATE INDEX idx_products_size ON products (size);
CREATE INDEX idx_products_price_start ON products (price_start);
CREATE INDEX idx_products_buy_now_price ON products (buy_now_price);

-- Тестовые данные для таблицы users (добавляем еще пользователей)
INSERT INTO users (username, role, email, password_hash)
VALUES
  ('olga_ivanova', 'user', 'olga@example.com', 'hashed_password_olga'),
  ('peter_sidorov', 'user', 'peter@example.com', 'hashed_password_peter'),
  ('ivan_petrov', 'user', 'ivan@example.com', 'hashed_password_ivan'),
  ('anna_smirnova', 'user', 'anna@example.com', 'hashed_password_anna'),
  ('max_kozlov', 'admin', 'max@example.com', 'hashed_password_max');

-- Тестовые данные для таблицы categories (если нужно больше)
INSERT INTO categories (name)
VALUES
  ('Спорт'),
  ('Классика'),
  ('Повседневная'),
  ('Эспадрильи'),
  ('Сандалии'),
  ('Балетки'),
  ('Туфли'),
  ('Кроссовки');

-- Тестовые данные для таблицы products (женское - больше размеров и цветов)
INSERT INTO products (title, description, brand, color, size, material, season, gender, price_start, buy_now_price, category_id, image_url, image_url_2)
VALUES
  ('Хлопковые эспадрильи', 'мягкие хлопковые эспадрильи', 'AMI Paris', 'Белый', '37', 'Хлопок', 'Весна/Лето', 'женский', 220.00, 220.00, 4,
   'https://cdn-images.farfetch-contents.com/29/79/13/70/29791370_58883875_1000.jpg',
   'https://cdn-images.farfetch-contents.com/29/79/13/70/29791370_58883797_1000.jpg'),
  ('Сандалии Mantera', 'кожаные сандалии ручной работы', 'Hereu', 'Коричневый', '39', 'Кожа', 'Лето', 'женский', 387.00, 387.00, 5,
   'https://cdn-images.farfetch-contents.com/28/41/24/59/28412459_57751711_1000.jpg',
   'https://cdn-images.farfetch-contents.com/28/41/24/59/28412459_57751716_1000.jpg'),
  ('Балетки с леопардовым принтом', 'замшевые балетки с анималистичным принтом', 'GANNI', 'Леопард', '38', 'Замша', 'Все сезоны', 'женский', 325.00, 325.00, 6,
   'https://cdn-images.farfetch-contents.com/29/50/81/20/29508120_58888140_1000.jpg',
   'https://cdn-images.farfetch-contents.com/29/50/81/20/29508120_58888141_1000.jpg'),
  ('Туфли Ghillies 60', 'кожаные туфли на устойчивом каблуке', 'Chloé', 'Черный', '36', 'Кожа', 'Весна/Осень', 'женский', 842.00, 842.00, 7,
   'https://cdn-images.farfetch-contents.com/29/73/51/09/29735109_58893346_1000.jpg',
   'https://cdn-images.farfetch-contents.com/29/73/51/09/29735109_58893371_1000.jpg'),
  ('Хлопковые эспадрильи', 'мягкие хлопковые эспадрильи', 'AMI Paris', 'Красный', '38', 'Хлопок', 'Весна/Лето', 'женский', 230.00, 230.00, 4,
   'https://cdn-images.farfetch-contents.com/29/79/13/70/29791370_58883875_1000.jpg',
   'https://cdn-images.farfetch-contents.com/29/79/13/70/29791370_58883797_1000.jpg');

-- Тестовые данные для таблицы products (мужское - больше размеров)
INSERT INTO products (title, description, brand, color, size, material, season, gender, price_start, buy_now_price, category_id, image_url, image_url_2)
VALUES
  ('Handball Spezial Aluminum', 'классические кроссовки для гандбола', 'adidas', 'Серый', '43', 'Замша/Резина', 'Все сезоны', 'мужской', 85.00, 85.00, 8,
   'https://cdn-images.farfetch-contents.com/20/91/95/27/20919527_50824275_1000.jpg',
   'https://cdn-images.farfetch-contents.com/20/91/95/27/20919527_50824274_1000.jpg'),
  ('Air Jordan 1 Low OG Reverse Mocha', 'лимитированная коллаборация', 'Jordan x Travis Scott', 'Коричневый/Белый', '42', 'Кожа/Резина', 'Все сезоны', 'мужской', 2130.00, 2130.00, 8,
   'https://cdn-images.farfetch-contents.com/18/39/92/39/18399239_40770228_1000.jpg',
   'https://cdn-images.farfetch-contents.com/18/39/92/39/18399239_40769319_1000.jpg'),
  ('9060 Mushroom Brown', 'современные кроссовки в стиле ретро', 'New Balance', 'Бежевый', '44', 'Замша/Сетка/Резина', 'Весна/Лето/Осень', 'мужской', 363.00, 363.00, 8,
   'https://cdn-images.farfetch-contents.com/22/29/52/83/22295283_52136272_1000.jpg',
   'https://cdn-images.farfetch-contents.com/22/29/52/83/22295283_52136273_1000.jpg'),
  ('530', 'классические беговые кроссовки', 'New Balance', 'Белый/Синий', '41', 'Сетка/Синтетика/Резина', 'Весна/Лето', 'мужской', 142.00, 142.00, 8,
   'https://cdn-images.farfetch-contents.com/19/52/47/28/19524728_43509670_1000.jpg',
   'https://cdn-images.farfetch-contents.com/19/52/47/28/19524728_43509669_1000.jpg'),
  ('Air Jordan 1 Low Premium', 'премиальная версия низких джорданов', 'Jordan', 'Светло-коричневый', '40', 'Кожа/Замша/Резина', 'Все сезоны', 'мужской', 254.00, 254.00, 8,
   'https://cdn-images.farfetch-contents.com/29/65/16/50/29651650_58933204_1000.jpg',
   'https://cdn-images.farfetch-contents.com/29/65/16/50/29651650_58933061_1000.jpg'),
  ('Pampanga Spzl', 'специальное издание кроссовок', 'adidas', 'Зеленый', '42', 'Текстиль/Резина', 'Лето', 'мужской', 128.00, 128.00, 8,
   'https://cdn-images.farfetch-contents.com/29/80/43/91/29804391_58916632_1000.jpg',
   'https://cdn-images.farfetch-contents.com/29/80/43/91/29804391_58916583_1000.jpg'),
  ('Handball Spezial Aluminum', 'классические кроссовки для гандбола', 'adidas', 'Черный', '44', 'Замша/Резина', 'Все сезоны', 'мужской', 90.00, 90.00, 1,
   'https://via.placeholder.com/500/000000/FFFFFF?Text=Adidas+Handball+Black1',
   'https://via.placeholder.com/500/000000/FFFFFF?Text=Adidas+Handball+Black2');

-- Тестовые данные для таблицы reviews (больше отзывов для разных товаров)
INSERT INTO reviews (user_id, product_id, rating, comment)
VALUES
  (1, 1, 5, 'Идеально подошли!'),
  (2, 1, 4, 'Хорошее качество.'),
  (3, 2, 5, 'Очень удобные для прогулок.'),
  (1, 3, 3, 'Цвет немного отличается от фото.'),
  (2, 4, 5, 'Элегантные туфли.'),
  (3, 5, 4, 'Классика всегда в моде.'),
  (1, 6, 5, 'Редкая находка!'),
  (2, 7, 4, 'Комфортные на каждый день.'),
  (3, 8, 3, 'Ожидал лучшего качества.'),
  (1, 9, 5, 'Стильные кроссовки.'),
  (2, 10, 4, 'Винтажный вайб.'),
  (3, 1, 5, 'Еще одни отличные эспадрильи от AMI!');

-- Тестовые данные для таблицы cart_items (больше товаров в корзинах разных пользователей)
INSERT INTO cart_items (user_id, product_id, quantity)
VALUES
  (1, 1, 1),
  (1, 5, 1),
  (2, 2, 1),
  (2, 7, 2),
  (3, 3, 1),
  (3, 9, 1);

-- Тестовые данные для таблицы orders (больше заказов с разными статусами)
INSERT INTO orders (user_id, status)
VALUES
  (1, 'completed'),
  (2, 'pending'),
  (3, 'processing'),
  (1, 'shipped'),
  (2, 'completed');

-- Тестовые данные для таблицы order_items (больше позиций в заказах)
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
  (1, 1, 1, 220.00),
  (1, 5, 1, 85.00),
  (2, 2, 1, 387.00),
  (3, 3, 1, 325.00),
  (3, 7, 1, 363.00),
  (4, 9, 1, 254.00),
  (5, 1, 1, 220.00),
  (5, 8, 1, 142.00);

-- Тестовые данные для таблицы bids (больше ставок на разные товары)
INSERT INTO bids (user_id, product_id, bid_amount)
VALUES
  (2, 6, 2150.00),
  (1, 6, 2200.00),
  (3, 4, 800.00),
  (1, 4, 820.00);

-- женское:
-- AMI Paris
-- хлопковые эспадрильи
-- 220 €
-- https://cdn-images.farfetch-contents.com/29/79/13/70/29791370_58883875_1000.jpg
-- https://cdn-images.farfetch-contents.com/29/79/13/70/29791370_58883797_1000.jpg

-- Hereu
-- сандалии Mantera
-- 387 €
-- https://cdn-images.farfetch-contents.com/28/41/24/59/28412459_57751711_1000.jpg
-- https://cdn-images.farfetch-contents.com/28/41/24/59/28412459_57751716_1000.jpg

-- GANNI
-- балетки с леопардовым принтом
-- 325 €
-- https://cdn-images.farfetch-contents.com/29/50/81/20/29508120_58888140_1000.jpg
-- https://cdn-images.farfetch-contents.com/29/50/81/20/29508120_58888141_1000.jpg

-- Chloé
-- туфли Ghillies 60
-- 842 €
-- https://cdn-images.farfetch-contents.com/29/73/51/09/29735109_58893346_1000.jpg
-- https://cdn-images.farfetch-contents.com/29/73/51/09/29735109_58893371_1000.jpg

-- мужское:
-- adidas
-- кроссовки Handball Spezial 'Aluminum'
-- 85 €
-- https://cdn-images.farfetch-contents.com/20/91/95/27/20919527_50824275_1000.jpg
-- https://cdn-images.farfetch-contents.com/20/91/95/27/20919527_50824274_1000.jpg

-- Jordan
-- кроссовки Air Jordan 1 Low OG Reverse Mocha из коллаборации с Travis Scott
-- 2.130 €
-- https://cdn-images.farfetch-contents.com/18/39/92/39/18399239_40770228_1000.jpg
-- https://cdn-images.farfetch-contents.com/18/39/92/39/18399239_40769319_1000.jpg

-- New Balance
-- кроссовки 9060 Mushroom Brown
-- 363 €
-- https://cdn-images.farfetch-contents.com/22/29/52/83/22295283_52136272_1000.jpg
-- https://cdn-images.farfetch-contents.com/22/29/52/83/22295283_52136273_1000.jpg

-- New Balance
-- кроссовки 530
-- 142 €
-- https://cdn-images.farfetch-contents.com/19/52/47/28/19524728_43509670_1000.jpg
-- https://cdn-images.farfetch-contents.com/19/52/47/28/19524728_43509669_1000.jpg

-- Jordan
-- кроссовки Air Jordan 1 Low Premium Pale Ivory/Baroque Brown
-- 254 €
-- https://cdn-images.farfetch-contents.com/29/65/16/50/29651650_58933204_1000.jpg
-- https://cdn-images.farfetch-contents.com/29/65/16/50/29651650_58933061_1000.jpg

-- adidas
-- кроссовки Pampanga Spzl
-- 128 евро
-- https://cdn-images.farfetch-contents.com/29/80/43/91/29804391_58916632_1000.jpg
-- https://cdn-images.farfetch-contents.com/29/80/43/91/29804391_58916583_1000.jpg