import { useEffect, useState } from 'react';
import { getOrders, getOrderDetails } from '../api/api';

export default function OrderHistory({ token }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders(token);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    setDetailsLoading(true);
    try {
      const response = await getOrderDetails(orderId, token);
      setOrderDetails(response.data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading orders...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Order History</h4>
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <p className="text-muted">No orders found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><strong>{order.order_number || `ORDER-${new Date(order.created_at).toISOString().slice(0,10).replace(/-/g,'')}-${String(order.id).padStart(3, '0')}`}</strong></td>
                          <td>{order.customer_name}</td>
                          <td>
                            <small className="text-muted">
                              {order.item_count || 0} item(s)
                            </small>
                          </td>
                          <td>${order.total_amount || 0}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'completed' ? 'bg-success' : 
                              order.status === 'pending' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => viewOrderDetails(order.id)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Details</h5>
            </div>
            <div className="card-body">
              {detailsLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : orderDetails ? (
                <div>
                  <h6>{orderDetails.order.order_number || `ORDER-${new Date(orderDetails.order.created_at).toISOString().slice(0,10).replace(/-/g,'')}-${String(orderDetails.order.id).padStart(3, '0')}`}</h6>
                  <p className="mb-2">
                    <strong>Customer:</strong> {orderDetails.order.customer_name}<br/>
                    <strong>Date:</strong> {new Date(orderDetails.order.created_at).toLocaleDateString()}<br/>
                    <strong>Status:</strong> 
                    <span className={`badge ms-1 ${
                      orderDetails.order.status === 'completed' ? 'bg-success' : 
                      orderDetails.order.status === 'pending' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {orderDetails.order.status || 'completed'}
                    </span>
                  </p>
                  
                  <h6 className="mt-3">Items:</h6>
                  {orderDetails.details && orderDetails.details.length > 0 ? (
                    orderDetails.details.map(detail => (
                      <div key={detail.id} className="d-flex justify-content-between mb-2 p-2 border rounded">
                        <div>
                          <small className="fw-bold">{detail.product_name}</small><br/>
                          <small className="text-muted">${Number(detail.price).toFixed(2)} x {detail.quantity}</small>
                        </div>
                        <div className="text-end">
                          <small className="fw-bold">${Number(detail.subtotal).toFixed(2)}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No items found</p>
                  )}
                  
                  <div className="border-top pt-2 mt-2">
                    <strong>Total: ${Number(orderDetails.order.total_amount).toFixed(2)}</strong>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Select an order to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}