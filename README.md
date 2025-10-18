# Simple Orders App

Aplikasi sederhana untuk mengelola pesanan produk dengan fitur login, manajemen produk, dan riwayat pesanan.

## Fitur

- ✅ Login dan Logout
- ✅ List Produk (nama, harga, stok, kategori)
- ✅ Buat Pesanan: Pilih produk dan jumlah
- ✅ Lihat Riwayat Pesanan
- ✅ Dashboard Analytics
- ✅ Product Management (CRUD)
- ✅ Search & Filter

## Tech Stack

**Backend:**
- Node.js + Express
- SQLite Database
- JWT Authentication
- bcrypt untuk password hashing

**Frontend:**
- React + Vite
- Bootstrap 5
- Axios untuk API calls

## Quick Start dengan Docker

```bash
# Clone repository
git clone <repository-url>
cd order_app

# Jalankan dengan docker-compose
docker-compose up --build

# Akses aplikasi
Frontend: http://localhost:3000
Backend API: http://localhost:3001
```

## Development Mode

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /login` - Login user
- `GET /products` - Get all products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /dashboard/stats` - Get dashboard statistics

## Default Login

- Username: `admin`
- Password: `password`

## Database Schema

**Users:**
- id, username, password

**Products:**
- id, name, price, stock, category

**Orders:**
- id, product_id, quantity, username, created_at