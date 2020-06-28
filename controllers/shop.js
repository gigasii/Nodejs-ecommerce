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
  Product.findAll()
  .then(([rows]) => {
    res.render('shop/product-list', 
    {
      products: rows,
      pageTitle: 'All products',
      path: '/products'
    });
  })
  .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
  Product.findByID(req.params.productID)
  .then(([rows]) => {
    res.render('shop/product-detail',
    {
      product: rows[0],
      pageTitle: rows[0].title,
      path: '/products'
    });
  })
  .catch(err => console.log(err));
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
  Product.findByID(req.body.productID, product => {
    Cart.addProduct(product.id, product.price);
  })
  res.redirect('/cart')
}

exports.postDeleteProduct = (req, res, next) => {
  Product.findByID(req.body.productID, product => {
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

