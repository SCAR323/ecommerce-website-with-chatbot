const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FAQ = sequelize.define('FAQ', {
    faqId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    keywords: {
        type: DataTypes.JSON,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

module.exports = FAQ;
