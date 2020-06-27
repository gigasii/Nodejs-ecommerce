// Third-party packages
const mysql = require('mysql2');

// Initilization
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node',
    password: 'giggsroxz123'
});

module.exports = pool.promise();