import { useState, useEffect } from 'react';
import { getProducts, createOrder } from '../api/api';

export default function OrderForm({ token }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product_id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = async () => {
    if (!customerName.trim() || cart.length === 0) {
      setMessage('Customer name and cart items are required');
      return;
    }
    
    try {
      const orderData = { 
        customer_name: customerName.trim(),
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };
      const res = await createOrder(orderData, token);
      
      setOrderInfo({
        orderId: res.data.order_id,
        orderNumber: res.data.order_number,
        customerName: customerName,
        items: cart,
        totalAmount: getTotalAmount(),
        orderDate: new Date().toLocaleDateString('id-ID')
      });
      
      setMessage('');
      setCart([]);
      setCustomerName('');
      
      // Refresh products to update stock
      getProducts().then(res => setProducts(res.data));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create order');
      setOrderInfo(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Products</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {products.map(product => (
                  <div key={product.id} className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">
                          Price: ${product.price}<br/>
                          Stock: {product.stock}
                        </p>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Shopping Cart</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input 
                  className="form-control" 
                  type="text" 
                  placeholder="Enter customer name"
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  required
                />
              </div>
              
              {cart.length === 0 ? (
                <p className="text-muted">Cart is empty</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.product_id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                      <div>
                        <small className="fw-bold">{item.name}</small><br/>
                        <small>${item.price} x {item.quantity} = ${item.price * item.quantity}</small>
                      </div>
                      <div>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="mx-1">{item.quantity}</span>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-top pt-2 mt-2">
                    <strong>Total: ${getTotalAmount()}</strong>
                  </div>
                </>
              )}
              
              <button 
                className="btn btn-success w-100 mt-3" 
                onClick={handleOrder}
                disabled={!customerName.trim() || cart.length === 0}
              >
                Create Order
              </button>
              
              {message && (
                <div className="alert alert-danger mt-3">
                  {message}
                </div>
              )}
              
              {orderInfo && (
                <div className="alert alert-success mt-3">
                  <h6 className="alert-heading">Order Created Successfully!</h6>
                  <hr />
                  <div>
                    <strong>Order No:</strong> {orderInfo.orderNumber}<br/>
                    <strong>Date:</strong> {orderInfo.orderDate}<br/>
                    <strong>Customer:</strong> {orderInfo.customerName}<br/>
                    <strong>Items:</strong> {orderInfo.items.length}<br/>
                    <strong>Total:</strong> ${orderInfo.totalAmount}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}