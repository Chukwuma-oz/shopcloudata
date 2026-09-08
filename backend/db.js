const mysql = require("mysql2/promise");

let pool;

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

async function initializeDatabase() {
  const db = createPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(80) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
      emoji VARCHAR(20) NOT NULL,
      description TEXT NOT NULL,
      stock INT NOT NULL DEFAULT 100,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(150) NOT NULL,
      customer_email VARCHAR(190) NOT NULL,
      address TEXT NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Received',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_id BIGINT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  const [rows] = await db.query("SELECT COUNT(*) AS count FROM products");

  if (rows[0].count === 0) {
    const products = [
      ["Cloud Runner Sneakers","Fashion",79.99,4.8,"👟","Comfortable everyday sneakers for walking, travel and casual wear.",100],
      ["Aero Wireless Headphones","Electronics",129.99,4.7,"🎧","Wireless over-ear headphones with rich sound and long battery life.",80],
      ["SmartFit Watch","Electronics",99.99,4.6,"⌚","Smart watch for notifications, activity tracking and daily use.",60],
      ["Urban Backpack","Accessories",54.99,4.5,"🎒","Durable backpack with room for a laptop and accessories.",90],
      ["Minimal Desk Lamp","Home",39.99,4.4,"💡","Modern desk lamp for study, work and home offices.",120],
      ["Travel Coffee Mug","Home",24.99,4.8,"☕","Reusable insulated mug for coffee and other hot drinks.",150],
      ["Classic Cotton Hoodie","Fashion",64.99,4.7,"🧥","Soft cotton hoodie with a simple everyday fit.",75],
      ["Mechanical Keyboard","Electronics",89.99,4.9,"⌨️","Responsive mechanical keyboard for coding and office work.",70]
    ];

    await db.query(
      `INSERT INTO products
       (name, category, price, rating, emoji, description, stock)
       VALUES ?`,
      [products]
    );
  }

  return db;
}

module.exports = { createPool, initializeDatabase };
