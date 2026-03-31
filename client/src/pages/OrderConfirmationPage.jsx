import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, ArrowRight, ShoppingBag, Clock, MapPin } from 'lucide-react'
import api from '../lib/api'

const STATUS_STYLES = {
  placed:    'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  ready:     'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  completed: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
  cancelled: 'bg-red-50 text-red-400 dark:bg-red-950 dark:text-red-400',
}

export default function OrderConfirmationPage() {
  const { id } = useParams()

  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data),
  })

  const order = orders.find((o) => o._id === id)

  if (!order) {
    return (
      <div className="t-bg min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const originalTotal = order.items.reduce((sum, i) => sum + (i.priceAtPurchase * i.qty * (1 + (order.savingsAmount / order.total))), 0)

  return (
    <div className="t-bg min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-16">

        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold t-text-1 mb-2">Order placed!</h1>
          <p className="t-text-3">
            Head to the store before pickup time. Your food will be ready.
          </p>
        </div>

        {/* Order card */}
        <div className="t-card rounded-2xl border t-border overflow-hidden mb-6">
          {/* Status + ID */}
          <div className="px-5 py-4 border-b t-border flex items-center justify-between">
            <div>
              <p className="text-xs t-text-4 mb-0.5">Order ID</p>
              <p className="text-xs font-mono t-text-2">{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="px-5 py-4 space-y-3 border-b t-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 t-muted rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <ShoppingBag size={16} className="t-text-4" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium t-text-1 truncate">{item.name}</p>
                  <p className="text-xs t-text-4">×{item.qty}</p>
                </div>
                <p className="text-sm font-bold t-text-1">₹{item.priceAtPurchase * item.qty}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm t-text-3">
              <span>Original price</span>
              <span className="line-through">₹{order.total + order.savingsAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-orange-500 font-medium">
              <span>You saved</span>
              <span>−₹{order.savingsAmount}</span>
            </div>
            <div className="flex justify-between font-bold t-text-1 pt-2 border-t t-border">
              <span>Total paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Pickup reminder */}
        <div className="t-muted rounded-2xl p-5 mb-6 flex gap-3">
          <Clock size={18} className="text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold t-text-1 mb-0.5">Pick up before the time expires</p>
            <p className="text-xs t-text-3">Prices drop as pickup time approaches — your price is locked at the moment of purchase.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 t-card border t-border py-3 rounded-xl text-sm font-semibold t-text-2 hover:border-orange-300 transition-colors">
            <ShoppingBag size={15} /> My orders
          </Link>
          <Link to="/marketplace"
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
            Browse more <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
