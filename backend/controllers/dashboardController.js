const dashboardController = {
  getStats: (req, res) => {
    // Mock data - replace with real database queries
    const stats = {
      totalOrders: 150,
      totalRevenue: 25000,
      totalProducts: 25,
      totalCustomers: 45,
      recentOrders: [
        { id: 1, product: 'Laptop', quantity: 1, total: 1200, date: new Date().toISOString() },
        { id: 2, product: 'Mouse', quantity: 2, total: 50, date: new Date().toISOString() },
        { id: 3, product: 'Keyboard', quantity: 1, total: 80, date: new Date().toISOString() }
      ],
      topProducts: [
        { name: 'Laptop', sales: 45, revenue: 54000 },
        { name: 'Mouse', sales: 120, revenue: 3000 },
        { name: 'Keyboard', sales: 80, revenue: 6400 }
      ]
    };
    res.json(stats);
  }
};

module.exports = dashboardController;