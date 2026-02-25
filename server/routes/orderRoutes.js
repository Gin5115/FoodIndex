const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);

// Seller routes
router.get('/seller-orders', protect, sellerOnly, getSellerOrders);
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);

module.exports = router;
