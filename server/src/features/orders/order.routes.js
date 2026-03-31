import { Router } from 'express'
import { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus } from './order.controller.js'
import { protect, sellerOnly } from '../../middleware/auth.js'

const router = Router()

router.post('/', protect, placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/seller', protect, sellerOnly, getSellerOrders)
router.put('/:id/status', protect, sellerOnly, updateOrderStatus)

export default router
