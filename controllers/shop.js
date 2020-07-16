// Third-party packages
const PDFDocument = require('pdfkit');

// Core packages
const fs = require('fs');
const path = require('path');

// Imports
const Product = require('../models/product');
const Order = require('../models/order');

// Constants
const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}

exports.getProducts = (req, res, next) => {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page))
    {
        page = 1;
    }

    let totalProds;
	Product.find().countDocuments()
	.then(numProducts => {
        totalProds = numProducts;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
	})
	.then(products => {
		res.render('shop/product-list', {
			products: products,
			pageTitle: 'All products',
            path: '/products',
            hasNextPage: (ITEMS_PER_PAGE * page) < totalProds,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page  -1
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order => {
        if (!order)
        {
            return next(new Error('No such order found'));
        }

        const invoiceName = orderId + '-invoice.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

        // Create pdf document
        const doc = new PDFDocument();
        doc.pipe(res);
        //doc.pipe(fs.createWriteStream(path.join('invoices', invoiceName)));
    
        // Write to pdf
        doc.text('--- Order ---');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.productData.price;
            doc.text(prod.productData.title + ' - ' + prod.quantity + ' x ' + '$' + prod.productData.price);
        });
        doc.text('------'); 
        doc.text('Total: $' + totalPrice);

        // Close the pdf and save
        doc.end();
    });
}
