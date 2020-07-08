// Third-party packages
const express = require('express');

// Imports
const adminController = require('../controllers/admin');

// Initilization
const router = express.Router();

// Set routes
router.get('/product-list', adminController.getProducts);
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/edit-product/:productID', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct)

// Export
module.exports = router;