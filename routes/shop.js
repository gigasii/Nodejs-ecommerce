// Third-party packages
const express = require('express');

// Imports
const shopController = require('../controllers/shop');
const auth = require('../middleware/auth');

// Initilization
const router = express.Router();

// Set routes
router.get('/products', shopController.getProducts);
router.get('/product/:productID', shopController.getProduct);
router.get('/cart', auth, shopController.getCart);
router.post('/cart', auth, shopController.postCart);
router.get('/orders', auth, shopController.getOrder);
router.get('/orders/:orderId', auth, shopController.getInvoice);
router.get('/checkout', auth, shopController.getCheckOut);
router.get('/checkout/success', shopController.getCheckOutSuccess);
router.delete('/delete-cart-product', auth, shopController.deleteCartProduct);

// Export
module.exports = router;