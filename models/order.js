// Third-party packages
const Sequelize = require('sequelize');

// Imports
const sequelize = require('../database');

// Define the table structure
const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

// Export
module.exports = Order;
