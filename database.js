// Third-party packages
const Sequalize = require('sequelize');

// Create connections to the database
const sequalize = new Sequalize('node', 'root', 'giggsroxz123', {
    dialect: 'mysql',
    host: 'localhost'
});

// Export
module.exports = sequalize;