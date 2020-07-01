// Imports
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
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
    // Create (Build + Save) product to database
    req.user.createProduct({
        title: req.body.title,
        price: req.body.price,
        imageURL: req.body.imageURL,
        description: req.body.description
    })
    .then(() => res.redirect('/admin/product-list'));
}

exports.getEditProduct = (req, res, next) => {
    Product.findByPk(req.params.productID)
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
    Product.findByPk(req.body.productID)
    .then(product => {
        product.title = req.body.title,
        product.price = req.body.price;
        product.imageURL = req.body.imageURL;
        product.description = req.body.description;
        // Save product to database
        return product.save();
    })
    .then(() => res.redirect('/admin/product-list'));
}

exports.postDeleteProduct = (req, res, next) => {
    Product.findByPk(req.body.productID)
    .then(product => {
        // Destroy product from database
        return product.destroy();  
    })
    .then(() => res.redirect('/admin/product-list'));
}