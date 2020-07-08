// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

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
const store = new MongoDbStore({
    uri: MONGO_DB_URI,
    collection: 'sessions'
});

// Templating package
app.set('view engine', 'ejs');
app.set('views', 'templates')

// Data parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serving files statically middleware
app.use(express.static(path.join(__dirname, 'public')));

/* 
    Session middleware:
    Looks for a session cookie, if found, look for a 
    fitting session in database and load data
*/
app.use(session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
}));

// Set user
app.use((req, res, next) => {
    if (!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    });
});

// Route-handling middlewares
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
