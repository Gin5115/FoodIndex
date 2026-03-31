import Order from '../../models/Order.js'
import Product from '../../models/Product.js'
import { computeCurrentPrice, computeDiscount } from '../../utils/pricingAlgorithm.js'

// POST /api/orders — buyer places an order
export const placeOrder = async (req, res) => {
  const { items } = req.body   // [{ productId, qty }]

  if (!items?.length) {
    return res.status(400).json({ message: 'Cart is empty' })
  }

  let orderItems = []
  let total = 0
  let originalTotal = 0

  for (const { productId, qty } of items) {
    const product = await Product.findById(productId)

    if (!product || !product.active || product.soldOut) {
      return res.status(400).json({ message: `${product?.name || 'A product'} is no longer available` })
    }
    if (product.stock < qty) {
      return res.status(400).json({ message: `Only ${product.stock} of "${product.name}" left` })
    }

    const currentPrice = computeCurrentPrice(product.toObject({ virtuals: true }))

    // Deduct stock
    product.stock -= qty
    if (product.stock === 0) product.soldOut = true

    // Write price history entry on purchase
    product.priceHistory.push({
      price: currentPrice,
      reason: `purchase — ${qty} unit(s) sold`,
    })

    await product.save()

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      qty,
      priceAtPurchase: currentPrice,
    })

    total += currentPrice * qty
    originalTotal += product.originalPrice * qty
  }

  const order = await Order.create({
    buyer: req.user._id,
    items: orderItems,
    total,
    savingsAmount: originalTotal - total,
  })

  res.status(201).json(order)
}

// GET /api/orders/my — buyer's own orders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('items.product', 'name image category')
    .sort({ createdAt: -1 })
  res.json(orders)
}

// GET /api/orders/seller — all orders containing seller's products
export const getSellerOrders = async (req, res) => {
  // Find products belonging to this seller
  const sellerProducts = await Product.find({ seller: req.user._id }).select('_id')
  const productIds = sellerProducts.map((p) => p._id)

  const orders = await Order.find({
    'items.product': { $in: productIds },
  })
    .populate('buyer', 'name email')
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 })

  // Filter each order's items to only show this seller's products
  const filtered = orders.map((order) => {
    const obj = order.toObject()
    obj.items = obj.items.filter((item) =>
      productIds.some((id) => id.equals(item.product._id))
    )
    return obj
  })

  res.json(filtered)
}

// PUT /api/orders/:id/status — seller updates order status
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const allowed = ['placed', 'ready', 'completed', 'cancelled']

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })

  order.status = status
  await order.save()
  res.json(order)
}
