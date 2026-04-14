import mongoose from 'mongoose'

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  reason: { type: String },   // e.g. "purchase", "stock update"
  recordedAt: { type: Date, default: Date.now },
})

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['bread', 'pastry', 'drink', 'snack', 'other'],
      required: true,
    },
    image: { type: String, default: '' },

    // Pricing
    originalPrice: { type: Number, required: true },
    // currentPrice is NOT stored — it's computed on every fetch via pricingAlgorithm.js

    // Inventory
    stock: { type: Number, required: true, min: 0 },
    initialStock: { type: Number, required: true },   // snapshot at listing time

    // Time window
    pickupTime: { type: Date, required: true },    // when food expires / must be collected by

    // Demand signals (incremented by view/watch actions)
    viewsToday: { type: Number, default: 0 },
    viewsLastHour: { type: Number, default: 0 },
    watchersCount: { type: Number, default: 0 },

    // Price history — written only on meaningful events (purchases, manual updates)
    priceHistory: [priceHistorySchema],

    soldOut: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Compound indexes for marketplace queries
productSchema.index({ pickupTime: 1, soldOut: 1, active: 1 })
productSchema.index({ seller: 1, active: 1 })

const Product = mongoose.model('Product', productSchema)
export default Product
