const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/simple_orders.sqlite');
const db = new sqlite3.Database(dbPath);

// Buat table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    stock INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE,
    username TEXT,
    customer_name TEXT,
    total_amount DECIMAL(10,2),
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add order_number column if it doesn't exist
  db.run(`ALTER TABLE orders ADD COLUMN order_number TEXT`, (err) => {
    // Ignore error if column already exists
  });
  db.run(`ALTER TABLE orders ADD COLUMN customer_name TEXT`, (err) => {
    // Ignore error if column already exists
  });
  db.run(`ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2)`, (err) => {
    // Ignore error if column already exists
  });
  db.run(`ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'completed'`, (err) => {
    // Ignore error if column already exists
  });

  db.run(`CREATE TABLE IF NOT EXISTS order_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
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

  // Clear existing sample data
  db.run('DELETE FROM order_details WHERE order_id = 1');
  db.run('DELETE FROM orders WHERE id = 1');
  
  // Sample order
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  db.run(`INSERT INTO orders (id, order_number, username, customer_name, total_amount, status) VALUES 
    (1, 'ORDER-${today}-001', 'admin', 'John Doe', 1250, 'completed')
  `);

  // Sample order details
  db.run(`INSERT INTO order_details (order_id, product_id, quantity, price, subtotal) VALUES 
    (1, 1, 1, 1200, 1200),
    (1, 2, 2, 25, 50)
  `);
});

module.exports = db;
