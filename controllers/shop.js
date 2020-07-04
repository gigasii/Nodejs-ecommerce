// Imports
const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Shop',
    path: '/'
  });
}

exports.getProducts = (req, res, next) => {
  // Get all products from Product table
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      products: products,
      pageTitle: 'All products',
      path: '/products'
    });
  });
}

exports.getProduct = (req, res, next) => {
  Product.findByID(req.params.productID)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(products => {
    res.render('shop/cart', {
      pageTitle: 'Your cart',
      path: '/cart',
      products: products
    });
  });
}

exports.postCart = (req, res, next) => {
  const id = req.body.productID;
  Product.findByID(id)
  .then(product => {
    req.user.addToCart(product)
    .then(() => res.redirect('/cart'));
  });
}

exports.postDeleteProduct = (req, res, next) => {
  req.user.deleteFromCart(req.body.productID)
  .then(() => res.redirect('/cart'));
}

exports.getOrder = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder()
  .then(() => res.redirect('/orders'));
}

