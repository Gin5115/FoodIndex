import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Phone, Store } from 'lucide-react'
import api from '../lib/api'
import FoodCard from '../components/FoodCard'

const TYPE_LABEL = { restaurant: 'Restaurant', cafe: 'Café', bakery: 'Bakery', other: 'Food Store' }

export default function SellerProfilePage() {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['seller', id],
    queryFn: () => api.get(`/products/seller/${id}/listings`).then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="t-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse space-y-4">
          <div className="h-32 t-muted rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-56 t-muted rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="t-bg min-h-screen flex items-center justify-center t-text-3">
        Seller not found.
      </div>
    )
  }

  const { seller, products } = data

  return (
    <div className="t-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Seller header */}
        <div className="t-card rounded-2xl border t-border p-7 mb-8 flex items-start gap-5">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950 rounded-2xl flex items-center justify-center shrink-0">
            <Store size={28} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold t-text-1">{seller.businessName}</h1>
              <span className="text-xs font-semibold bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">
                {TYPE_LABEL[seller.businessType] || 'Food Store'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              {seller.businessAddress && (
                <span className="flex items-center gap-1.5 text-sm t-text-3">
                  <MapPin size={13} className="text-orange-500" /> {seller.businessAddress}
                </span>
              )}
              {seller.phone && (
                <span className="flex items-center gap-1.5 text-sm t-text-3">
                  <Phone size={13} className="text-orange-500" /> {seller.phone}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-extrabold t-text-1">{products.length}</p>
            <p className="text-xs t-text-4">active listings</p>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-lg font-semibold t-text-1 mb-5">Active deals</h2>

        {products.length === 0 ? (
          <div className="t-card rounded-2xl border t-border py-20 text-center t-text-4">
            <Store size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium t-text-3">No active listings right now</p>
            <p className="text-sm mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => <FoodCard key={p._id} product={{ ...p, seller }} />)}
          </div>
        )}
      </div>
    </div>
  )
}
