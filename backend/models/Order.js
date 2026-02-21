/**
 * Order Model — JSON File Storage
 * Orders are stored in backend/data/orders.json
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

function readOrders() {
    try {
        const data = fs.readFileSync(ORDERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function findByUserId(userId) {
    const orders = readOrders();
    return orders
        .filter((o) => o.user === userId)
        .map(o => ({ ...o, _id: o._id || o.id }));
}

function findById(id) {
    const orders = readOrders();
    const order = orders.find((o) => o.id === id || o._id === id);
    if (order) {
        return { ...order, _id: order._id || order.id };
    }
    return null;
}

function createOrder(orderData) {
    const orders = readOrders();
    const id = "ORD_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const newOrder = {
        ...orderData,
        id: id,
        _id: id, // For frontend compatibility
        isPaid: false,
        isDelivered: false,
        createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    writeOrders(orders);
    return newOrder;
}

function updateOrder(id, updates) {
    const orders = readOrders();
    const index = orders.findIndex((o) => o.id === id || o._id === id); // Handle both id and _id for compatibility
    if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        writeOrders(orders);
        return orders[index];
    }
    return null;
}

module.exports = { findByUserId, findById, createOrder, updateOrder };
