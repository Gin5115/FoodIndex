import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Package, TrendingDown, ArrowLeft, ShoppingBag, Eye, MapPin, Store } from 'lucide-react'
import api from '../lib/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import PriceChart from '../components/PriceChart'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [watched, setWatched] = useState(false)

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
  })

  const { mutate: watch, isPending: watching } = useMutation({
    mutationFn: () => api.post(`/products/${id}/watch`),
    onSuccess: (res) => {
      setWatched(true)
      qc.setQueryData(['product', id], (old) => ({
        ...old,
        watchersCount: res.data.watchersCount,
        currentPrice: res.data.currentPrice,
        discountPercent: res.data.discountPercent,
      }))
    },
  })

  if (isLoading) {
    return (
      <div className="t-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12 animate-pulse">
          <div className="h-4 t-muted rounded w-24 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-80 t-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 t-muted rounded w-1/3" />
              <div className="h-7 t-muted rounded w-2/3" />
              <div className="h-24 t-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="t-bg min-h-screen max-w-5xl mx-auto px-6 py-20 text-center t-text-4">
        <p className="font-medium">Product not found.</p>
      </div>
    )
  }

  const minutesLeft = Math.max(Math.round((new Date(product.pickupTime) - Date.now()) / 60000), 0)
  const urgency = minutesLeft <= 60
  const soldOut = product.soldOut || product.stock === 0

  const handleAddToCart = () => {
    if (!user) return navigate('/login')
    addItem(product)
    navigate('/cart')
  }

  return (
    <div className="t-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm t-text-4 hover:t-text-1 mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden t-muted h-80 relative">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/40 dark:to-amber-900/30">
                  <Store size={56} className="text-orange-300" />
                </div>
              )}
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{product.discountPercent}% off
              </div>
            </div>

            {/* Demand signals */}
            <div className="flex gap-3">
              <div className="flex-1 surface px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest t-text-4 mb-0.5">Views today</p>
                <p className="mono text-lg font-semibold t-text-1">{product.viewsToday}</p>
              </div>
              <div className="flex-1 surface px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest t-text-4 mb-0.5">Watching</p>
                <p className="mono text-lg font-semibold t-text-1">{product.watchersCount}</p>
              </div>
            </div>

            {/* Price chart */}
            <PriceChart
              priceHistory={product.priceHistory}
              originalPrice={product.originalPrice}
              currentPrice={product.currentPrice}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold t-text-4 uppercase tracking-widest mb-2">
                {product.seller?.businessName
                  ? <Link to={`/sellers/${product.seller._id}`} className="hover:text-orange-500 transition-colors">{product.seller.businessName}</Link>
                  : product.seller?.name} · {product.category}
              </p>
              <h1 className="text-3xl font-bold t-text-1 mb-2">{product.name}</h1>
              {product.description && (
                <p className="t-text-3 text-sm leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Live price */}
            <div className="surface p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-orange-600 mb-3">Live price</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="mono text-5xl font-black t-text-1 tracking-tight">₹{product.currentPrice}</span>
                <span className="mono text-lg t-text-4 line-through">₹{product.originalPrice}</span>
                <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded-md">
                  -{product.discountPercent}% off
                </span>
              </div>
              <p className="text-xs t-text-4">Recomputed on every load — time · stock · demand</p>
            </div>

            {/* Time + stock + location */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium ${
                urgency ? 'bg-red-50 dark:bg-red-950/40 text-red-600' : 't-muted t-text-3'
              }`}>
                <Clock size={13} />
                <span className="mono">{urgency ? `${minutesLeft}m left` : `${Math.round(minutesLeft / 60)}h left`}</span>
              </div>
              <div className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium t-muted t-text-3">
                <Package size={13} />
                <span className="mono">{product.stock} remaining</span>
              </div>
            </div>

            {product.seller?.businessAddress && (
              <div className="flex items-start gap-2 text-sm t-text-3 surface px-4 py-3">
                <MapPin size={13} className="mt-0.5 text-orange-600 shrink-0" />
                <span>{product.seller.businessAddress}</span>
              </div>
            )}

            {/* Watch button */}
            {!user?.isSeller && !soldOut && (
              <button
                onClick={() => watch()}
                disabled={watching || watched}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  watched
                    ? 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 text-orange-600 cursor-default'
                    : 'border-[var(--border)] t-text-3 hover:border-orange-500/40 hover:text-orange-600'
                }`}
                style={{ borderRadius: '6px' }}
              >
                <Eye size={14} />
                {watched ? 'Watching — price updated' : watching ? 'Watching...' : 'Watch this deal'}
              </button>
            )}

            {/* Add to cart */}
            {!user?.isSeller && (
              <button
                onClick={handleAddToCart}
                disabled={soldOut}
                className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-[var(--bg-muted)] disabled:t-text-4 text-white py-3 rounded-md font-medium transition-colors"
              >
                <ShoppingBag size={15} />
                {soldOut ? 'Sold out' : 'Add to cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
