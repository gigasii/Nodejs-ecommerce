// Imports
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    // Get all products from collection 
    Product.find()
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
    const product = new Product({
        title: req.body.title, 
        price: req.body.price, 
        description: req.body.description,
        imageURL: req.body.imageURL,
        userId: req.user._id
    });
    // Save new product to collection
    product.save()
    .then(() => res.redirect('/admin/product-list'));
}

exports.getEditProduct = (req, res, next) => {
    Product.findById(req.params.productID)
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
    Product.findById(req.body.productID)
    .then(product => {
        product.title = req.body.title; 
        product.price = req.body.price; 
        product.description = req.body.description;
        product.imageURL = req.body.imageURL;
        // If save is called on an existing product (Update)
        return product.save();
    })
    .then(() => res.redirect('/admin/product-list'));
}

exports.postDeleteProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.body.productID)
    .then(() => res.redirect('/admin/product-list'));
}