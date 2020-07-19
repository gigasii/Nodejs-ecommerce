// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

// Core packages
const path = require('path');

// Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const status = require('./controllers/status');
const User = require('./models/user');

// Constants
const MONGO_DB_URI = 'mongodb+srv://giggs:123@shop.nlvcf.mongodb.net/Shop?retryWrites=true&w=majority';
const IMAGE_FOLDER_NAME = 'images';

// Initilization
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, IMAGE_FOLDER_NAME);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const filter = (req, file, callback) => {
    (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') ? callback(null, true) : callback(null, false);
}

// Templating package
app.set('view engine', 'ejs');
app.set('views', 'templates');

// Data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({storage: storage, fileFilter: filter}).single('imageFile'));

// Files inside these folders are assumed to be from root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, IMAGE_FOLDER_NAME)));

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
app.get('/500', status.serverError);
app.use(status.pageNotFound);

// Error-handling
app.use((error, req, res, next) => {
    res.redirect('/500');
});

// Connect to database
mongoose.connect(MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    // Server constantly listening
    app.listen(3000);
});
