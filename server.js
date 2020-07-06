// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Core packages
const path = require('path');

// Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoute = require('./controllers/error');
const User = require('./models/user');

// Initilization
const app = express();

// Templating package
app.set('view engine', 'ejs');
app.set('views', 'templates')

// Data parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serving files statically middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set user
app.use((req, res, next) => {
    User.findById('5f01a3305e712a29230f81ba')
    .then(user => {
        req.user = user;
        next();
    });
});

// Route-handling middlewares
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoute);

// Connect to database
mongoose.connect('mongodb+srv://giggs:123@shop.nlvcf.mongodb.net/Shop?retryWrites=true&w=majority')
.then(result => {
    // Server constantly listening
    app.listen(3000);
});
