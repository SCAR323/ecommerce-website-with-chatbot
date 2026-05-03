const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    images: {
        type: DataTypes.JSON,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    features: {
        type: DataTypes.JSON,
    },
    specs: {
        type: DataTypes.JSON,
    }
});

module.exports = Product;
