const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        try {
            const order = await Order.create({
                orderItems,
                userId: req.user.id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            res.status(201).json(order);
        } catch (error) {
            console.error("Create order error:", error);
            res.status(500).json({ message: 'Failed to create order' });
        }
    }
});


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.user.id } });
        res.json(orders);
    } catch (error) {
        console.error("Get my orders error:", error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Get order by ID error:", error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', auth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };

            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Update order to paid error:", error);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

module.exports = router;
