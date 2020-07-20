// Third-party packages
const express = require('express');

// Imports
const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

// Initilization
const router = express.Router();

// Set routes
router.get('/product-list', auth, adminController.getProducts);
router.get('/add-product', auth, adminController.getAddProduct);
router.post('/add-product', auth, adminController.postAddProduct);
router.get('/edit-product/:productID', auth, adminController.getEditProduct);
router.post('/edit-product', auth, adminController.postEditProduct);
router.delete('/delete-product/:productID', auth, adminController.deleteProduct);

// Export
module.exports = router;