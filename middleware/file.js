// Core packages
const fs = require('fs');
const path = require('path');

exports.deleteFile = (filePath) => {
    filePath = path.join(__dirname, '..', 'public', filePath);
    fs.unlink(filePath, error => {
        console.log(error);
    });
}