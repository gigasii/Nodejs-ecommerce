// Third-party packages
const Sequalize = require('sequelize');

// Imports
const sequalize = require('../database');

// Define the table structure
const Cart = sequalize.define('cart', {
    id: {
        type: Sequalize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    }
});

// Export
module.exports = Cart;