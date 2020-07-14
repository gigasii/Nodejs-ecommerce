// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

// Core packages
const path = require('path');

// Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoute = require('./controllers/error');
const User = require('./models/user');

// Constants
const MONGO_DB_URI = 'mongodb+srv://giggs:123@shop.nlvcf.mongodb.net/Shop?retryWrites=true&w=majority';

// Initilization
const app = express();

// Templating package
app.set('view engine', 'ejs');
app.set('views', 'templates');

// Data parsing
app.use(bodyParser.urlencoded({ extended: false }));

// Static files directory path
app.use(express.static(path.join(__dirname, 'public')));

// Create or use existing session
app.use(session({
    secret: 'SessionSecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoDbStore({uri: MONGO_DB_URI, collection: 'sessions'})
}));

// Set user
app.use((req, res, next) => {
    // Session doesnt exists
    if (!req.session.user)
    {
        return next();
    }
    // Session exists
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    });
});

// Enable CSRF protection
app.use(csurf());

// Enable flashing of session variables
app.use(flash());

// Variables to be included for every request
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // Generate token
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Route-handling
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoute);

// Connect to database
mongoose.connect(MONGO_DB_URI)
.then(() => {
    // Server constantly listening
    app.listen(3000);
});
