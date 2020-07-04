// Core packages
const path = require('path');

// Third-party packages
const express = require('express');

// Imports
const shopController = require('../controllers/shop');

// Initilization
const router = express.Router();

// Set routes
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product/:productID', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postDeleteProduct);
router.get('/orders', shopController.getOrder);
router.post('/create-order', shopController.postOrder);

// Export
module.exports = router;