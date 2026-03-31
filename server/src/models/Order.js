import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  qty: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true },  // snapshot — price when order was placed
})

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['placed', 'ready', 'completed', 'cancelled'],
      default: 'placed',
    },
    savingsAmount: { type: Number, default: 0 },  // originalTotal - total
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)
export default Order
