// Imports
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('admin/product-list', {
            prods: products,
            pageTitle: 'Admin products',
            path: '/admin/product-list'
        });
    });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', 
    {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageURL, null);
    product.save()
    .then(() => res.redirect('/admin/product-list'));
}

exports.getEditProduct = (req, res, next) => {
    Product.findByID(req.params.productID)
    .then(product => {
        res.render('admin/edit-product', 
        {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: req.query.edit,
            product: product
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageURL, req.body.productID);
    product.save()
    .then(() => res.redirect('/admin/product-list'));
}

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteByID(req.body.productID)
    .then(() => res.redirect('/admin/product-list'));
}