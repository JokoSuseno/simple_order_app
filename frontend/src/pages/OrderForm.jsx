import { useState, useEffect } from 'react';
import { getProducts, createOrder } from '../api/api';

export default function OrderForm({ token }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const handleOrder = async () => {
    if (!customerName.trim()) {
      setMessage('Customer name is required');
      return;
    }
    
    try {
      const orderData = { 
        product_id: productId, 
        quantity: parseInt(quantity),
        customer_name: customerName.trim()
      };
      const res = await createOrder(orderData, token);
      
      const selectedProduct = products.find(p => p.id == productId);
      const orderDate = new Date().toLocaleDateString('id-ID');
      
      setOrderInfo({
        orderId: res.data.order_id,
        customerName: customerName,
        productName: selectedProduct?.name,
        quantity: quantity,
        totalPrice: selectedProduct?.price * quantity,
        orderDate: orderDate
      });
      
      setMessage('');
      // Reset form
      setProductId('');
      setQuantity(1);
      setCustomerName('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create order');
      setOrderInfo(null);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Create Order</h4>
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
        <div className="mb-3">
          <label className="form-label">Product</label>
          <select 
            className="form-select" 
            onChange={e => setProductId(e.target.value)}
            value={productId}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - Stock: {p.stock}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input 
            className="form-control" 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={e => setQuantity(e.target.value)} 
          />
        </div>
        <button 
          className="btn btn-success w-100" 
          onClick={handleOrder}
          disabled={!productId || !customerName.trim()}
        >
          Save Order
        </button>
        
        {message && (
          <div className="alert alert-danger mt-3">
            {message}
          </div>
        )}
        
        {orderInfo && (
          <div className="alert alert-success mt-3">
            <h6 className="alert-heading">Order Saved Successfully!</h6>
            <hr />
            <div className="row">
              <div className="col-6">
                <strong>Order No:</strong> #{orderInfo.orderId}<br/>
                <strong>Date:</strong> {orderInfo.orderDate}<br/>
                <strong>Customer:</strong> {orderInfo.customerName}
              </div>
              <div className="col-6">
                <strong>Product:</strong> {orderInfo.productName}<br/>
                <strong>Quantity:</strong> {orderInfo.quantity}<br/>
                <strong>Total:</strong> ${orderInfo.totalPrice}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
