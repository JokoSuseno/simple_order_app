const db = require('../models/db');

exports.createOrder = (req, res) => {
  const { product_id, quantity, customer_name } = req.body;
  const username = req.user?.username || 'guest';

  db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Not enough stock' });

    db.run('INSERT INTO orders (product_id, quantity, username, customer_name) VALUES (?, ?, ?, ?)', 
      [product_id, quantity, username, customer_name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // update stock
        db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
        res.json({ success: true, order_id: this.lastID });
      });
  });
};

exports.getOrders = (req, res) => {
  const username = req.user?.username || 'guest';
  db.all('SELECT o.id, p.name as product, o.quantity, o.customer_name, o.created_at FROM orders o JOIN products p ON o.product_id = p.id WHERE o.username = ?', 
    [username], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
};
