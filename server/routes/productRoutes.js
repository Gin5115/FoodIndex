const express = require('express');
const router = express.Router();
const {
    getProducts,
    getTickerProducts,
    getLiveDrops,
    getTrendingProducts,
    getProductById,
    getPredictions,
    getPricingBreakdown,
    getNextDrop,
    trackView,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');
const { updatePrices } = require('../jobs/pricingEngine');

// ── Public routes ───────────────────────────────────────────
router.get('/ticker', getTickerProducts);
router.get('/ticker/live-drops', getLiveDrops);
router.get('/trending', getTrendingProducts);
router.get('/', getProducts);

// ── Pricing endpoints (public, before /:id) ─────────────────
router.get('/:id/predictions', getPredictions);
router.get('/:id/pricing-breakdown', getPricingBreakdown);
router.get('/:id/next-drop', getNextDrop);
router.post('/:id/view', trackView);

// ── Seller routes ───────────────────────────────────────────
router.get('/seller', protect, sellerOnly, getSellerProducts);
router.post('/', protect, sellerOnly, createProduct);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

// ── Admin: manual price update trigger ──────────────────────
router.post('/admin/trigger-price-update', protect, async (req, res) => {
    try {
        await updatePrices();
        res.json({ message: 'Price update triggered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── Public single product (must be last) ────────────────────
router.get('/:id', getProductById);

module.exports = router;
