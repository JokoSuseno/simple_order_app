import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001',
  timeout: 10000
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on port 3001');
    }
    return Promise.reject(error);
  }
);

export const login = (username, password) => API.post('/login', { username, password });

// Products
export const getProducts = (params = {}) => API.get('/products', { params });
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');

// Orders
export const createOrder = (data, token) => API.post('/orders', data, { headers: { Authorization: `Bearer ${token}` } });
export const getOrders = (token) => API.get('/orders', { headers: { Authorization: `Bearer ${token}` } });

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');
