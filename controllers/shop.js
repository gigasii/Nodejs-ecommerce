// Imports
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  res.render('shop/index',
  {
    pageTitle: 'Shop',
    path: '/'
  });
}

exports.getProducts = (req, res, next) => {
  Product.findAll(products => {
    res.render('shop/product-list', 
    {
      products: products,
      pageTitle: 'All products',
      path: '/products'
    });
  });
}

exports.getProduct = (req, res, next) => {
  const id = req.params.productID;
  Product.findByID(id, product => {
    res.render('shop/product-detail',
    {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getCart = (req, res, next) => {
  // Get cart 
  Cart.allProducts(cart => {
    // Get products
    Product.findAll(products => {
      const newCart = [];
      for (product of products)
      {
        const prod = cart.products.find(p => p.id === product.id);
        if (prod)
        {
          newCart.push({data: product, qty: prod.qty});
        }
      }
      res.render('shop/cart', 
      {
        pageTitle: 'Your cart',
        path: '/cart',
        products: newCart
      });
    });
  });
}

exports.postCart = (req, res, next) => {
  const id = req.body.productID;
  Product.findByID(id, product => {
    Cart.addProduct(product.id, product.price);
  })
  res.redirect('/cart')
}

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productID;
  Product.findByID(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
  });
}

exports.getCheckOut = (req, res, next) => {
  res.render('shop/checkout', 
  {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
}

