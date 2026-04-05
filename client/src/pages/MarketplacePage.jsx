import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, MapPin, Loader2 } from 'lucide-react'
import api from '../lib/api'
import FoodCard from '../components/FoodCard'

const CATEGORIES = ['all', 'bread', 'pastry', 'drink', 'snack', 'other']
const SORT_OPTIONS = [
  { value: 'expiry', label: 'Ending soon' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]

export default function MarketplacePage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('expiry')
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', category, search, sort, location],
    queryFn: () => {
      if (location) {
        return api.get('/products/nearby', {
          params: {
            lng: location.lng,
            lat: location.lat,
            maxKm: 5,
            ...(category !== 'all' && { category }),
          },
        }).then((r) => r.data)
      }
      return api.get('/products', {
        params: {
          ...(category !== 'all' && { category }),
          ...(search && { search }),
          sort,
        },
      }).then((r) => r.data)
    },
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setLocation(null)
  }

  const clearSearch = () => {
    setSearch('')
    setSearchInput('')
  }

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: 13.0827, lng: 80.2707 })
      setSearch('')
      setSearchInput('')
      return
    }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSearch('')
        setSearchInput('')
        setLocating(false)
      },
      (err) => {
        const msg = err.code === 1
          ? 'Location blocked — showing demo area (Chennai)'
          : 'Location unavailable — showing demo area (Chennai)'
        setLocation({ lat: 13.0827, lng: 80.2707 })
        setSearch('')
        setSearchInput('')
        setLocating(false)
        setLocError(msg)
      },
      { timeout: 3000, enableHighAccuracy: false, maximumAge: 0 }
    )
  }, [])

  const clearLocation = () => setLocation(null)

  return (
    <div className="t-bg min-h-screen">
      {/* Header */}
      <div className="t-bg border-b border-[var(--border)] px-5 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black t-text-1 tracking-tight mb-1">Marketplace</h1>
          <p className="t-text-4 text-sm mb-6">Prices drop live as pickup time approaches</p>

          <div className="flex gap-2 flex-wrap max-w-2xl">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 t-text-4" />
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border border-[var(--border)] t-card rounded-md pl-10 pr-4 py-2 text-sm t-text-1 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 placeholder:t-text-4 transition-colors"
                />
                {searchInput && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 t-text-4 hover:t-text-2">
                    <X size={12} />
                  </button>
                )}
              </div>
              <button type="submit" className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <SlidersHorizontal size={13} /> Search
              </button>
            </form>

            {/* Location toggle */}
            <button
              onClick={location ? clearLocation : handleLocate}
              disabled={locating}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                location
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'surface t-text-2 hover:border-orange-500/40 hover:text-orange-600'
              }`}
            >
              {locating ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
              {location ? 'Nearby' : locating ? 'Locating...' : 'Near me'}
              {location && <X size={11} />}
            </button>
          </div>

          {locError && <p className="text-red-400 text-xs mt-2">{locError}</p>}
          {location && (
            <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
              <MapPin size={11} /> Showing results within 5km of your location
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Filters row */}
        <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  category === c
                    ? 'bg-orange-600 text-white'
                    : 'surface t-text-3 hover:t-text-1 hover:border-[var(--border-md)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort — hidden in nearby mode */}
          {!location && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-[var(--border)] t-card rounded-md px-3 py-1.5 text-xs t-text-2 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Results count */}
        {!isLoading && !isError && (
          <p className="text-xs t-text-4 mb-5">
            {products.length} {products.length === 1 ? 'listing' : 'listings'}
            {search && ` for "${search}"`}
            {category !== 'all' && ` in ${category}`}
            {location && ' nearby'}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="t-muted rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-400 text-sm">Failed to load listings. Try refreshing.</div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 t-text-4">
            <Search size={36} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium t-text-3 mb-1">No listings found</p>
            <p className="text-sm">
              {location ? 'No active deals within 5km.' : 'Try a different search or check back soon.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <FoodCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
