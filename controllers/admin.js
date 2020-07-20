// Imports
const Product = require('../models/product');
const fileHelper = require('../middleware/file');

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
        editing: false,
        errorMessage: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const image = req.file;
    if (!image)
    {
        return res.render('admin/edit-product', 
        {
            pageTitle: 'Add product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: 'Attached file is not an image'
        });   
    }
    const product = new Product({
        title: req.body.title, 
        price: req.body.price, 
        description: req.body.description,
        imageURL: image.filename,
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
            product: product,
            errorMessage: false
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const image = req.file;
    Product.findById(req.body.productID)
    .then(product => {
        product.title = req.body.title; 
        product.price = req.body.price; 
        product.description = req.body.description;
        if (image)
        {
            fileHelper.deleteFile(product.imageURL);
            product.imageURL = image.filename;
        }
        // If save is called on an existing product (Update)
        return product.save();
    })
    .then(() => res.redirect('/admin/product-list'));
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productID;
    Product.findById(prodId)
    .then(product => {
        //fileHelper.deleteFile(product.imageURL);
        return Product.deleteOne({_id: prodId});
    })
    .then(() => {
        return req.user.deleteFromCart(prodId)
    })
    .then(() => res.status(200).json({
        message: 'Product deleted from server'
    }))
    .catch(err => {
        next(err);
    });
}