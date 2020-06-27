// Imports
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll(products => {
        res.render('admin/product-list', 
        {
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

exports.getEditProduct = (req, res, next) => {
    Product.findByID(req.params.productID, product => {
        res.render('admin/edit-product', 
        {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: req.query.edit,
            product: product
        });
    });
}

exports.postAddProduct = (req, res, next) => {
    const newProduct = new Product(null, req.body.title, req.body.imageURL, req.body.description, req.body.price);
    newProduct.save();
    res.redirect('/products');
}

exports.postEditProduct = (req, res, next) => {
    const updatedProduct = new Product(req.body.productID, req.body.title, req.body.imageURL, req.body.description, req.body.price);
    updatedProduct.save();
    res.redirect('/admin/product-list');
}

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteByID(req.body.productID);
    res.redirect('/admin/product-list');
}