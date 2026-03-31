import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react'
import { useCart } from '../context/CartContext'
import api from '../lib/api'

export default function CartPage() {
  const { items, total, removeItem, updateQty, syncPrices, clearCart } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [priceChanges, setPriceChanges] = useState({}) // productId → {old, new}
  const [refreshing, setRefreshing] = useState(false)

  // Detect expired items and stale prices on mount
  useEffect(() => {
    if (items.length === 0) return
    refreshPrices()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const refreshPrices = async () => {
    setRefreshing(true)
    try {
      const results = await Promise.all(
        items.map((item) => api.get(`/products/${item._id}`).then((r) => r.data).catch(() => null))
      )
      const fresh = results.filter(Boolean)
      const changes = {}
      for (const item of items) {
        const freshItem = fresh.find((p) => p._id === item._id)
        if (freshItem && freshItem.currentPrice !== item.currentPrice) {
          changes[item._id] = { old: item.currentPrice, next: freshItem.currentPrice }
        }
      }
      setPriceChanges(changes)
      syncPrices(fresh)
    } finally {
      setRefreshing(false)
    }
  }

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: () =>
      api.post('/orders', {
        items: items.map((i) => ({ productId: i._id, qty: i.qty })),
      }),
    onSuccess: (res) => {
      clearCart()
      navigate(`/order-confirmation/${res.data._id}`)
    },
    onError: (err) => setError(err.response?.data?.message || 'Checkout failed'),
  })

  const originalTotal = items.reduce((sum, i) => sum + i.originalPrice * i.qty, 0)
  const savings = originalTotal - total

  const expiredItems = items.filter((i) => new Date(i.pickupTime) < new Date())
  const hasChanges = Object.keys(priceChanges).length > 0

  if (items.length === 0) {
    return (
      <div className="t-bg min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 t-muted rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={32} className="t-text-4" />
          </div>
          <h2 className="text-xl font-semibold t-text-1 mb-2">Your cart is empty</h2>
          <p className="t-text-4 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Browse marketplace <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="t-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black t-text-1 tracking-tight">Your cart</h1>
          <button
            onClick={refreshPrices}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs t-text-4 hover:t-text-2 transition-colors"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            Refresh prices
          </button>
        </div>

        {/* Expired item warning */}
        {expiredItems.length > 0 && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Pickup time passed</span> for{' '}
              {expiredItems.map((i) => i.name).join(', ')}.{' '}
              <button
                onClick={() => expiredItems.forEach((i) => removeItem(i._id))}
                className="underline font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Price change notice */}
        {hasChanges && (
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl mb-5 text-sm">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>
              Prices updated since you added these items — totals reflect the latest prices.
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Items */}
          <div className="lg:col-span-2 space-y-2">
            {items.map((item) => {
              const expired = new Date(item.pickupTime) < new Date()
              const changed = priceChanges[item._id]
              return (
                <div
                  key={item._id}
                  className={`t-card rounded-xl shadow-card p-4 flex gap-4 items-center ${expired ? 'opacity-60' : ''}`}
                >
                  <div className="w-14 h-14 rounded-lg t-muted flex-shrink-0 overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={18} className="t-text-4" /></div>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold t-text-1 truncate text-sm">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm font-bold t-text-1">₹{item.currentPrice}</span>
                      <span className="text-xs t-text-4 line-through">₹{item.originalPrice}</span>
                      {changed && (
                        <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          was ₹{changed.old}
                        </span>
                      )}
                    </div>
                    {expired && <p className="text-[11px] text-red-500 mt-0.5">Pickup time passed</p>}
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="w-6 h-6 rounded-md t-muted flex items-center justify-center transition-colors hover:bg-stone-200 dark:hover:bg-stone-600"
                    >
                      <Minus size={11} className="t-text-2" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold t-text-1">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      className="w-6 h-6 rounded-md t-muted flex items-center justify-center transition-colors hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-30"
                    >
                      <Plus size={11} className="t-text-2" />
                    </button>
                  </div>

                  <p className="font-bold t-text-1 w-16 text-right text-sm">
                    ₹{item.currentPrice * item.qty}
                  </p>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="t-text-4 hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="t-card rounded-xl shadow-card p-5 sticky top-20">
              <h2 className="font-semibold t-text-1 mb-4 text-sm">Order summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm t-text-4">
                  <span>Original</span>
                  <span className="line-through">₹{originalTotal}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-orange-600">
                  <span className="flex items-center gap-1"><Tag size={11} /> You save</span>
                  <span>−₹{savings}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold t-text-1 text-base border-t border-[var(--border)] pt-3 mb-5">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={() => checkout()}
                disabled={isPending || expiredItems.length > 0}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-40"
              >
                {isPending ? 'Placing order...' : <>Place order <ArrowRight size={13} /></>}
              </button>

              {expiredItems.length > 0 && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Remove expired items to continue
                </p>
              )}

              <p className="text-[11px] t-text-4 text-center mt-3">
                Prices may update between now and checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
