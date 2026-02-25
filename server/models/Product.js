const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    restaurant: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        default: 'General',
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    currentPrice: {
        type: Number,
        required: true,
    },
    basePrice: {
        type: Number, // Minimum acceptable price (seller's floor)
    },
    pickupTime: {
        type: String,
        default: '22:00',
    },
    image: {
        type: String,
        default: '',
    },
    stock: {
        type: Number,
        default: 10,
    },
    isTrending: {
        type: Boolean,
        default: false,
    },
    soldOut: {
        type: Boolean,
        default: false,
    },

    // ── TIMING ──────────────────────────────────────────────
    listedAt: {
        type: Date,
        default: Date.now,
    },
    expiryTime: {
        type: Date,
    },

    // ── DEMAND TRACKING ─────────────────────────────────────
    viewsToday: { type: Number, default: 0 },
    viewsLastHour: { type: Number, default: 0 },
    watchersCount: { type: Number, default: 0 },

    // ── STOCK TRACKING ──────────────────────────────────────
    initialStock: { type: Number },
    currentStock: { type: Number },

    // ── PRICING HISTORY ─────────────────────────────────────
    priceHistory: [{
        price: Number,
        timestamp: { type: Date, default: Date.now },
        reason: String,
    }],

    // ── PRICING METADATA ────────────────────────────────────
    lastPriceUpdate: { type: Date },
    nextPriceUpdate: { type: Date },

    // ── SELLER PRICING SETTINGS ─────────────────────────────
    pricingStrategy: {
        aggressiveness: { type: Number, default: 5, min: 1, max: 10 },
        minProfitMargin: { type: Number, default: 0.3 },
        enableDemandPricing: { type: Boolean, default: true },
    },

    // ── STATUS ──────────────────────────────────────────────
    isPaused: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// ── VIRTUALS ────────────────────────────────────────────────

productSchema.virtual('discount').get(function () {
    return Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
});

productSchema.virtual('timeRemaining').get(function () {
    if (!this.expiryTime) return null;
    const now = new Date();
    const diff = this.expiryTime - now;
    return diff > 0 ? Math.floor(diff / (1000 * 60)) : 0; // minutes
});

// ── PRE-SAVE HOOK — auto-convert pickupTime → expiryTime ────

productSchema.pre('save', function (next) {
    // If expiryTime doesn't exist but pickupTime does, create expiryTime
    if (!this.expiryTime && this.pickupTime) {
        const today = new Date();
        const [hours, minutes] = this.pickupTime.split(':');
        const expiryTime = new Date(today);
        expiryTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // If the time has already passed today, set it for tomorrow
        if (expiryTime < today) {
            expiryTime.setDate(expiryTime.getDate() + 1);
        }

        this.expiryTime = expiryTime;
    }

    // Auto-set initialStock from stock if missing
    if (!this.initialStock && this.stock) {
        this.initialStock = this.stock;
    }
    if (!this.currentStock && this.stock) {
        this.currentStock = this.stock;
    }

    next();
});

// ── INDEXES ─────────────────────────────────────────────────

productSchema.index({ expiryTime: 1, soldOut: 1, isPaused: 1 });
productSchema.index({ seller: 1, soldOut: 1 });

module.exports = mongoose.model('Product', productSchema);
