const Product = require('../models/Product');
const { calculateDynamicPrice } = require('../utils/pricingAlgorithm');
const { predictFuturePrices } = require('../utils/pricePrediction');

// @desc    Get all products (with optional geospatial sort)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { lat, lng, dist } = req.query;

        // 1. If location is provided, find sellers nearby first
        if (lat && lng) {
            const User = require('../models/User'); // Lazy load to avoid circular dependency if any
            const maxDistance = (parseInt(dist) || 50) * 1000; // Default 50km

            // a. Find sellers near the user
            const sellers = await User.aggregate([
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                        distanceField: 'distance',
                        maxDistance: maxDistance,
                        spherical: true,
                        query: { isSeller: true } // Only look for sellers
                    }
                },
                { $project: { _id: 1, distance: 1 } }
            ]);

            if (sellers.length === 0) {
                return res.json([]); // No sellers nearby
            }

            // b. Create a map of SellerID -> Distance
            const sellerDistMap = {};
            sellers.forEach(s => {
                sellerDistMap[s._id.toString()] = s.distance;
            });

            // c. Find products from these sellers
            const products = await Product.find({
                seller: { $in: sellers.map(s => s._id) },
                soldOut: false
            }).lean();

            // d. Attach distance and sort
            const productsWithDist = products.map(p => {
                const d = sellerDistMap[p.seller ? p.seller.toString() : ''] || Infinity;
                return {
                    ...p,
                    distance: (d / 1000).toFixed(1) // Convert meters to km string "1.2"
                };
            });

            // Sort by distance (ascending)
            productsWithDist.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

            return res.json(productsWithDist);
        }

        // 2. Default behavior (no location)
        const products = await Product.find({ soldOut: false }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get ticker products (5 random items for marquee)
// @route   GET /api/products/ticker
// @access  Public
const getTickerProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $match: { soldOut: false } },
            { $sample: { size: 5 } },
            { $project: { name: 1, restaurant: 1, originalPrice: 1, currentPrice: 1 } }
        ]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get live price drops for ticker (sorted by most recent drop)
// @route   GET /api/products/ticker/live-drops
// @access  Public
const getLiveDrops = async (req, res) => {
    try {
        const products = await Product.find({
            soldOut: false,
            expiryTime: { $gte: new Date() },
        })
            .sort({ lastPriceUpdate: -1 })
            .limit(20)
            .select('name restaurant originalPrice currentPrice lastPriceUpdate');

        const drops = products.map(p => ({
            _id: p._id,
            name: p.name,
            restaurant: p.restaurant,
            originalPrice: p.originalPrice,
            currentPrice: p.currentPrice,
            discount: Math.round(((p.originalPrice - p.currentPrice) / p.originalPrice) * 100),
        }));

        res.json(drops);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ isTrending: true, soldOut: false }).limit(6);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get price predictions for a product
// @route   GET /api/products/:id/predictions
// @access  Public
const getPredictions = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const predictions = predictFuturePrices(product);

        res.json({
            currentPrice: product.currentPrice,
            originalPrice: product.originalPrice,
            predictions,
            nextUpdate: product.nextPriceUpdate,
            priceHistory: (product.priceHistory || []).slice(-20),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get pricing factor breakdown for a product
// @route   GET /api/products/:id/pricing-breakdown
// @access  Public
const getPricingBreakdown = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { breakdown } = calculateDynamicPrice(product);

        res.json({
            breakdown,
            priceHistory: (product.priceHistory || []).slice(-20),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get next price drop info
// @route   GET /api/products/:id/next-drop
// @access  Public
const getNextDrop = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const predictions = predictFuturePrices(product);
        const nextDrop = predictions.length > 0 ? predictions[0] : null;

        res.json({
            currentPrice: product.currentPrice,
            nextUpdate: product.nextPriceUpdate,
            nextDrop: nextDrop
                ? {
                    time: nextDrop.time,
                    price: nextDrop.predictedPrice,
                    minutesUntil: Math.floor((new Date(nextDrop.time) - new Date()) / (1000 * 60)),
                }
                : null,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Track a product view
// @route   POST /api/products/:id/view
// @access  Public
const trackView = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $inc: {
                    viewsToday: 1,
                    viewsLastHour: 1,
                },
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ viewsToday: product.viewsToday, viewsLastHour: product.viewsLastHour });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get products for logged-in seller
// @route   GET /api/products/seller
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
    try {
        const { name, restaurant, category, originalPrice, currentPrice, pickupTime, image, stock, isTrending } = req.body;

        if (!name || !originalPrice) {
            return res.status(400).json({ message: 'Name and original price are required' });
        }

        if (originalPrice <= 0) {
            return res.status(400).json({ message: 'Price must be positive' });
        }

        const stockQty = stock ?? 10;
        const now = new Date();

        // Convert pickupTime string to expiryTime Date
        let expiryTime = null;
        if (pickupTime) {
            const [hours, minutes] = pickupTime.split(':');
            expiryTime = new Date(now);
            expiryTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            if (expiryTime < now) {
                expiryTime.setDate(expiryTime.getDate() + 1);
            }
        }

        const product = await Product.create({
            seller: req.user._id,
            name,
            restaurant: restaurant || req.user.name,
            category: category || 'General',
            originalPrice,
            currentPrice: currentPrice || originalPrice, // Start at original, engine drops it
            pickupTime: pickupTime || '22:00',
            image: image || '',
            isTrending: isTrending || false,

            // Pricing engine fields
            stock: stockQty,
            initialStock: stockQty,
            currentStock: stockQty,
            listedAt: now,
            expiryTime,
            viewsLastHour: 0,
            viewsToday: 0,
            watchersCount: 0,
            priceHistory: [{
                price: originalPrice,
                timestamp: now,
                reason: 'Initial listing',
            }],
            pricingStrategy: {
                aggressiveness: 5,
                minProfitMargin: 0.3,
                enableDemandPricing: true,
            },
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify seller owns this product
        if (product.seller && product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const updatedFields = {};
        const allowedFields = [
            'name', 'restaurant', 'category', 'originalPrice', 'currentPrice',
            'pickupTime', 'image', 'stock', 'currentStock', 'isTrending', 'soldOut', 'isPaused',
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updatedFields[field] = req.body[field];
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify seller owns this product
        if (product.seller && product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
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
};
