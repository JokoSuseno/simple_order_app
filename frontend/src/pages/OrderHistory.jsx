import { useEffect, useState } from 'react';
import { getOrders } from '../api/api';

export default function OrderHistory({ token }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders(token).then(res => setOrders(res.data));
  }, [token]);

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Order History</h4>
      </div>
      <div className="card-body">
        {orders.length === 0 ? (
          <div className="text-center text-muted">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><span className="badge bg-primary">#{o.id}</span></td>
                    <td>{o.customer_name || 'N/A'}</td>
                    <td>{o.product}</td>
                    <td><span className="badge bg-info">{o.quantity}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
