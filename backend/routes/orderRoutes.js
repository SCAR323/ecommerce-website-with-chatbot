const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { sendOrderConfirmation, sendPaymentSuccessEmail } = require('../utils/emailService');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret',
});

// @desc    Create new order & Razorpay order
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
    }

    try {
        // 1. Create Razorpay order
        let razorpayOrder;
        try {
            const options = {
                amount: Math.round(totalPrice * 100), // amount in paise
                currency: "INR",
                receipt: `receipt_order_${Date.now()}`
            };
            razorpayOrder = await razorpay.orders.create(options);
        } catch (rzpError) {
            console.error('Razorpay order creation failed. Check your API keys:', rzpError);
            return res.status(500).json({ message: 'Payment gateway configuration error. Please check Razorpay keys.' });
        }

        // 2. Save order in MongoDB
        const order = new Order({
            orderItems,
            user: req.user.id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentResult: {
                id: razorpayOrder.id,
                status: "created"
            }
        });

        const createdOrder = await order.save();

        res.status(201).json({
            order: createdOrder,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (error) {
        console.error("Get my orders error:", error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const admin = require('../middleware/admin');
router.get('/', auth, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id username email');
        res.json(orders);
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: 'Error fetching all orders' });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email');

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

// @desc    Update order to paid (Verify Razorpay Signature)
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', auth, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: razorpay_payment_id,
            status: "paid",
            update_time: new Date().toISOString(),
            email_address: req.user.email || req.body.email_address
        };

        const updatedOrder = await order.save();

        // Send payment success & order confirmation emails
        const user = await User.findById(req.user.id);
        if (user) {
            sendPaymentSuccessEmail(user.email, user.username, updatedOrder.totalPrice, razorpay_payment_id)
                .catch(err => console.error("Payment success email failed:", err.message));

            sendOrderConfirmation(user.email, user.username, updatedOrder._id, updatedOrder.totalPrice)
                .catch(err => console.error("Order confirmation email failed:", err.message));
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Payment update failed' });
    }
});

module.exports = router;
