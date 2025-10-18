let products = [
  { id: 1, name: 'Laptop', price: 1200, stock: 10, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, stock: 50, category: 'Electronics' },
  { id: 3, name: 'Keyboard', price: 80, stock: 30, category: 'Electronics' }
];

const productController = {
  getAll: (req, res) => {
    const { search, category } = req.query;
    let filtered = products;
    
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    res.json(filtered);
  },

  create: (req, res) => {
    const { name, price, stock, category } = req.body;
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category || 'General'
    };
    products.push(newProduct);
    res.json(newProduct);
  },

  update: (req, res) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const productIndex = products.findIndex(p => p.id == id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      price: price ? parseFloat(price) : products[productIndex].price,
      stock: stock ? parseInt(stock) : products[productIndex].stock,
      category: category || products[productIndex].category
    };
    
    res.json(products[productIndex]);
  },

  delete: (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id == id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
  },

  getCategories: (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
  }
};

module.exports = productController;