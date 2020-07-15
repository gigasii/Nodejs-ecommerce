// Third-party packages
const express = require('express');

// Imports
const shopController = require('../controllers/shop');
const auth = require('../middleware/auth');

// Initilization
const router = express.Router();

// Set routes
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product/:productID', shopController.getProduct);
router.get('/cart', auth, shopController.getCart);
router.post('/cart', auth, shopController.postCart);
router.post('/cart-delete-item', auth, shopController.postDeleteCartProduct);
router.get('/orders', auth, shopController.getOrder);
router.post('/create-order', auth, shopController.postOrder);
router.get('/orders/:orderId', auth, shopController.getInvoice);

// Export
module.exports = router;