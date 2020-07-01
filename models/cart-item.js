// Third-party packages
const Sequalize = require('sequelize');

// Imports
const sequalize = require('../database');

// Define the table structure
const CartItem = sequalize.define('cartItem', {
    id: {
        type: Sequalize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    quantity: {
        type: Sequalize.INTEGER,
        allowNull: false
    }
});

// Export
module.exports = CartItem;