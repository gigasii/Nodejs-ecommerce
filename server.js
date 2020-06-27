// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');

// Core packages
const path = require('path');

// Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// Initilization
const app = express();

// Templating package
app.set('view engine', 'ejs');
app.set('views', 'templates')

// Data parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serving files statically middleware
app.use(express.static(path.join(__dirname, 'public')));

// Route-handling middlewares
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error handling middleware
app.use(errorController.get404);

// Server constantly listening
app.listen(3000);