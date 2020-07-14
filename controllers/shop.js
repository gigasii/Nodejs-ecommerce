// Imports
const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Shop',
    path: '/'
  });
}

exports.getProducts = (req, res, next) => {
  // Get all products from collection
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      products: products,
      pageTitle: 'All products',
      path: '/products'
    });
  });
}

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productID)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.products.productId').execPopulate()
  .then(user => {
    res.render('shop/cart', {
      pageTitle: 'Your cart',
      path: '/cart',
      products: user.cart.products
    });
  });
}

exports.postCart = (req, res, next) => {
  Product.findById(req.body.productID)
  .then(product => {
    req.user.addToCart(product)
    .then(() => res.redirect('/cart'));
  });
}

exports.postDeleteCartProduct = (req, res, next) => {
  req.user.deleteFromCart(req.body.productID)
  .then(() => res.redirect('/cart'));
}

exports.getOrder = (req, res, next) => {
  // WHERE query
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
};

exports.postOrder = (req, res, next) => {
  req.user.populate('cart.products.productId').execPopulate()
  .then(user => {
    const products = user.cart.products.map(i => {
      return {productData: {...i.productId._doc}, quantity: i.quantity}
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user._id
      },
      products: products
    });
    return order.save();
  })
  .then(() => {
    return req.user.clearCart();
  })
  .then(() => res.redirect('/orders'));
}

