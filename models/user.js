// Third-party packages
const Sequalize = require('sequelize');

// Imports
const sequalize = require('../database');

// Define the table structure
const User = sequalize.define('user', {
    id: {
        type: Sequalize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: Sequalize.STRING,
        allowNull: false
    },
    email: {
        type: Sequalize.STRING,
        allowNull: false
    }
});

// Export
module.exports = User;