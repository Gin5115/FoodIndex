const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get orders containing seller's products
// @route   GET /api/orders/seller-orders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
    try {
        const Product = require('../models/Product');

        // Find all product IDs owned by this seller
        const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id);

        // Find orders that contain any of these products
        const orders = await Order.find({
            'orderItems.product': { $in: productIds }
        })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Fetch seller orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Placed', 'Ready', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Placed, Ready, or Completed' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus,
};
