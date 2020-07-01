// Third-party packages
const express = require('express');
const bodyParser = require('body-parser');

// Core packages
const path = require('path');

// Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoute = require('./controllers/error');
const sequelize = require('./database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const { start } = require('repl');

// Initilization
const app = express();

// Templating package
app.set('view engine', 'ejs');
app.set('views', 'templates')

// Data parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serving files statically middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set current user
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    });
});

// Route-handling middlewares
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoute);

// Establish table relations (Create Magic methods as well)
User.hasOne(Cart);
Cart.belongsTo(User);
User.hasOne(Order);
User.hasMany(Product);
Cart.belongsToMany(Product, {through: CartItem});
Order.belongsToMany(Product, {through: OrderItem});

// Retrive tables from database
sequelize.sync()
.then(() => {
    return User.findByPk(1);
})
.then(user => {
    if (!user)
    {
        User.create({name: 'Max', email: 'test@test.com'})
        .then(user => user.createCart())
        .then(cart => {
            cart.getUser()
            .then(user => {
                return user.createOrder();
            })
        })
    }
    else
    {
        return user;
    }
})
.then(() => app.listen(3000))   // Server constantly listening
