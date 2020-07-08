const user = require("../models/user");

exports.getLogIn = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogIn = (req, res, next) => {
    user.findById('5f01a3305e712a29230f81ba')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => res.redirect('/products'));
    })
};

exports.postLogOut = (req, res, next) => {
    // Destroy all session fields
    req.session.destroy(() => res.redirect('/products'));
};