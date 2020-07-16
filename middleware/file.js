// Core packages
const fs = require('fs');

exports.deleteFile = (filePath) => {
    fs.unlink('images\\' + filePath, (err) => {
        if (err)
        {
            throw(err);
        }
     });
}