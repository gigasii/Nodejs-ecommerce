// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');

// Core packages
const path = require('path');

// Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoute = require('./controllers/error');
const connectToDB = require('./database').connect;
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
    User.findByID('5f00a4743b7b49c1462b7a11')
    .then(user => {
        req.user = new User(user._id, user.name, user.email, user.cart);
        next();
    });
});

// Route-handling middlewares
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoute);

// Connect to database
connectToDB(() => {
    // Server constantly listening
    app.listen(3000);
});
