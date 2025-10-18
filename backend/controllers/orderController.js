const db = require('../models/db');
const { promisify } = require('util');

exports.createOrder = (req, res) => {
  const { customer_name, items } = req.body;
  const username = req.user?.username || 'guest';

  if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer name and items are required' });
  }

  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    let total_amount = 0;
    let validItems = [];
    let errors = [];
    
    // Validate all items first
    let validationPromises = items.map(item => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [item.product_id], (err, product) => {
          if (err || !product) {
            reject(`Product ${item.product_id} not found`);
            return;
          }
          if (product.stock < item.quantity) {
            reject(`Insufficient stock for ${product.name}`);
            return;
          }
          
          const subtotal = product.price * item.quantity;
          validItems.push({
            product_id: parseInt(item.product_id),
            quantity: parseInt(item.quantity),
            price: parseFloat(product.price),
            subtotal: subtotal
          });
          total_amount += subtotal;
          resolve();
        });
      });
    });
    
    Promise.all(validationPromises)
      .then(() => {
        // Generate order number
        const today = new Date();
        const dateStr = today.getFullYear() + 
                       String(today.getMonth() + 1).padStart(2, '0') + 
                       String(today.getDate()).padStart(2, '0');
        const orderPrefix = `ORDER-${dateStr}-`;
        
        db.get('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = DATE("now")', (err, result) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          const runningNumber = String((result.count || 0) + 1).padStart(3, '0');
          const orderNumber = `${orderPrefix}${runningNumber}`;
          
          // Create order
          db.run('INSERT INTO orders (order_number, username, customer_name, total_amount, status) VALUES (?, ?, ?, ?, ?)',
            [orderNumber, username, customer_name, total_amount, 'completed'], function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              const orderId = this.lastID;
              let completed = 0;
              
              validItems.forEach(item => {
                // Insert order detail
                db.run('INSERT INTO order_details (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
                  [orderId, item.product_id, item.quantity, item.price, item.subtotal], function(err) {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: err.message });
                    }
                    
                    // Update stock
                    db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id], (updateErr) => {
                      if (updateErr) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Failed to update stock' });
                      }
                      
                      completed++;
                      if (completed === validItems.length) {
                        db.run('COMMIT');
                        res.json({ 
                          success: true, 
                          order_id: orderId, 
                          order_number: orderNumber, 
                          total_amount: total_amount,
                          message: 'Order created successfully'
                        });
                      }
                    });
                  });
              });
            });
        });
      })
      .catch(error => {
        db.run('ROLLBACK');
        res.status(400).json({ error });
      });
  });
};

exports.getOrders = (req, res) => {
  const username = req.user?.username || 'guest';
  db.all(`SELECT o.id, o.order_number, o.username, o.customer_name, o.total_amount, o.status, o.created_at,
          COUNT(od.id) as item_count
   FROM orders o 
   LEFT JOIN order_details od ON o.id = od.order_id
   WHERE o.username = ? 
   GROUP BY o.id, o.order_number, o.username, o.customer_name, o.total_amount, o.status, o.created_at
   ORDER BY o.created_at DESC`, 
    [username], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
};

exports.getOrderDetails = (req, res) => {
  const { id } = req.params;
  const username = req.user?.username || 'guest';
  
  console.log('Getting order details for order ID:', id, 'username:', username);
  
  db.get('SELECT * FROM orders WHERE id = ? AND username = ?', [id, username], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    console.log('Found order:', order);
    
    db.all(`SELECT od.id, od.order_id, od.product_id, od.quantity, od.price, od.subtotal, p.name as product_name 
     FROM order_details od 
     JOIN products p ON od.product_id = p.id 
     WHERE od.order_id = ?
     ORDER BY od.id`, [id], (err, details) => {
      if (err) {
        console.error('Error getting order details:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Found order details:', details);
      res.json({ order, details });
    });
  });
};
