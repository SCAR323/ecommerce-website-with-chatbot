const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Order = require('../models/Order');

const productsFilePath = path.join(__dirname, '../../src/data/products.json');

// Helper to read products
const getProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write products
const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', auth, admin, (req, res) => {
    res.json(getProducts());
});

// @desc    Add a product
// @route   POST /api/admin/products
// @access  Private/Admin
router.post('/products', auth, admin, (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: req.body.name,
        price: parseFloat(req.body.price),
        category: req.body.category,
        description: req.body.description,
        images: [req.body.image],
        rating: 0,
        features: [],
        specs: {}
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', auth, admin, (req, res) => {
    let products = getProducts();
    const id = parseInt(req.params.id);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
        return res.status(404).json({ message: "Product not found" });
    }

    saveProducts(products);
    res.json({ message: "Product removed" });
});

module.exports = router;
