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
  Product.findByPk(req.params.productID)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getCart = (req, res, next) => {
  // User -> Cart
  req.user.getCart()
  .then(cart => {
    // Cart -> Products
    return cart.getProducts();
  })
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
  let globalCart;
  req.user.getCart()
  .then(cart => {
    globalCart = cart;
    return globalCart.getProducts({where: {id: id}});
  })
  .then(products => {
    if (products.length > 0)
    {
      let product = products[0];
      const oldQuantity = product.cartItem.quantity;
      return globalCart.addProduct(product, {through: {quantity: oldQuantity + 1}})
    }
    else
    {
      Product.findByPk(id)
      .then(product => {
        return globalCart.addProduct(product, {through: {quantity: 1}})
      });
    }
  })
  .then(() => res.redirect('/cart'));
}

exports.postDeleteProduct = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: req.body.productID}});
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(() => res.redirect('/cart'));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrder({include: ['products']})
  .then(order => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      order: order
    });
  })
};

exports.postOrder = (req, res, next) => {
  let globalCart;
  req.user.getCart()
  .then(cart => {
    globalCart = cart;
    return globalCart.getProducts();
  })
  .then(products => {
    req.user.getOrder()
    .then(order => {
      return order.addProduct(products.map(p => {
        p.orderItem = {quantity: p.cartItem.quantity};
        return p;
      }))
    })
  })
  .then(() => {
    globalCart.setProducts(null)
    .then(() => res.redirect('/orders'))
  });
}

