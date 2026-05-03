const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    specs: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
});

module.exports = mongoose.model("Product", ProductSchema);
