const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
    faqId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String],
        default: [],
    },
    content: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("FAQ", FAQSchema);
