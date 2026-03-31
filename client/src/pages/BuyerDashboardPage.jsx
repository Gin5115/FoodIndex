import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const STATUS_STYLES = {
  placed:    'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  ready:     'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  cancelled: 'bg-red-50 text-red-500 dark:bg-red-950/60 dark:text-red-400',
}

export default function BuyerDashboardPage() {
  const { user } = useAuth()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data),
  })

  const totalSaved = orders.reduce((sum, o) => sum + (o.savingsAmount || 0), 0)

  return (
    <div className="t-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-5 py-10">

        <div className="mb-10">
          <h1 className="text-3xl font-black t-text-1 tracking-tight">
            Hey, {user?.name?.split(' ')[0]}
          </h1>
          <p className="t-text-4 mt-1 text-sm">Your food rescue history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="t-card rounded-xl shadow-card p-5">
            <p className="text-[10px] uppercase tracking-[0.08em] font-medium t-text-4 mb-3">Orders placed</p>
            <p className="text-4xl font-black t-text-1 tracking-tight">{orders.length}</p>
          </div>
          <div className="bg-orange-600 rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-[0.08em] font-medium text-orange-200 mb-3">Total saved</p>
            <p className="text-4xl font-black text-white tracking-tight">₹{totalSaved}</p>
          </div>
        </div>

        <h2 className="text-sm font-semibold t-text-2 uppercase tracking-[0.06em] mb-4">Order history</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 t-muted rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="t-card rounded-xl shadow-card py-20 text-center">
            <ShoppingBag size={32} className="mx-auto mb-3 t-text-4 opacity-30" />
            <p className="font-medium t-text-3 mb-1">No orders yet</p>
            <p className="text-sm t-text-4">Go rescue some food from the marketplace</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order._id} className="t-card rounded-xl shadow-card p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1.5 text-xs t-text-4">
                    <Clock size={11} />
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-right flex items-center gap-3">
                    {order.savingsAmount > 0 && (
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        saved ₹{order.savingsAmount}
                      </span>
                    )}
                    <span className="text-sm font-bold t-text-1">₹{order.total}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {order.items.map((item, i) => (
                    <span key={i} className="t-muted rounded-md px-2.5 py-1.5 text-xs t-text-2">
                      {item.name} <span className="t-text-4">×{item.qty}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
