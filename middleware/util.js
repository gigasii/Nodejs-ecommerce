// Core packages
const path = require('path');

// Root directory of project
exports.rootDirectory = path.dirname(process.mainModule.filename);

// Authentication middleware
exports.authentication = (req, res, next) => {
    if (!req.session.isLoggedIn)
    {
        return res.redirect('/404');
    }
    next();
}