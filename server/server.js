require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializePricingEngine, shutdownPricingEngine } = require('./jobs/pricingEngine');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Connect to MongoDB, then start pricing engine
connectDB().then(() => {
    initializePricingEngine();
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ── GRACEFUL SHUTDOWN ───────────────────────────────────────

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    shutdownPricingEngine();
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received, shutting down...');
    shutdownPricingEngine();
    await mongoose.connection.close();
    process.exit(0);
});
