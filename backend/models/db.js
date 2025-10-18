const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/simple_orders.sqlite');
const db = new sqlite3.Database(dbPath);

// Buat table
db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    stock INTEGER
  )`);

  db.run(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    username TEXT,
    customer_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample data
  const bcrypt = require('bcrypt');
  const passwordHash = bcrypt.hashSync('password', 10);
  db.run(`INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'admin', ?)`, [passwordHash]);

  db.run(`INSERT OR IGNORE INTO products (id, name, price, stock) VALUES 
    (1, 'Laptop', 1200, 10),
    (2, 'Mouse', 25, 50),
    (3, 'Keyboard', 80, 30),
    (4, 'Monitor', 300, 15),
    (5, 'Headphone', 150, 20)
  `);
});

module.exports = db;
