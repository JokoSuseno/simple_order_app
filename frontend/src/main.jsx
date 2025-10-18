import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductManagement from './pages/ProductManagement';
import OrderForm from './pages/OrderForm';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!token) return <Login setToken={setToken} />;

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products token={token} />;
      case 'product-management': return <ProductManagement />;
      case 'orders': return <OrderForm token={token} />;
      case 'order-history': return <OrderHistory token={token} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Order App</span>
          <div className="navbar-nav me-auto">
            <button 
              className={`nav-link btn btn-link text-light ${activeTab === 'dashboard' ? 'fw-bold' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link btn btn-link text-light ${activeTab === 'products' ? 'fw-bold' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={`nav-link btn btn-link text-light ${activeTab === 'product-management' ? 'fw-bold' : ''}`}
              onClick={() => setActiveTab('product-management')}
            >
              Manage Products
            </button>
            <button 
              className={`nav-link btn btn-link text-light ${activeTab === 'orders' ? 'fw-bold' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Create Order
            </button>
            <button 
              className={`nav-link btn btn-link text-light ${activeTab === 'order-history' ? 'fw-bold' : ''}`}
              onClick={() => setActiveTab('order-history')}
            >
              Order History
            </button>
          </div>
          <button 
            className="btn btn-outline-light" 
            onClick={() => { setToken(''); localStorage.removeItem('token'); }}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="container-fluid">
        {renderContent()}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
