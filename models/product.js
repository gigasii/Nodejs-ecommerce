// Third-party packages
const Sequalize = require('sequelize');

// Imports
const sequalize = require('../database');

// Define the table structure
const Product = sequalize.define('product', {
    id: {
        type: Sequalize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    title: {
        type: Sequalize.STRING,
        allowNull: false
    },
    price: {
        type: Sequalize.DOUBLE,
        allowNull: false
    },
    imageURL: {
        type: Sequalize.STRING,
        allowNull: false
    },
    description: {
        type: Sequalize.STRING,
        allowNull: false
    }
});

// Export
module.exports = Product;