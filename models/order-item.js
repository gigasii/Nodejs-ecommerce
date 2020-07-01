// Third-party packages
const Sequelize = require('sequelize');

// Imports
const sequelize = require('../database');

// Define the table structure
const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Export
module.exports = OrderItem;
