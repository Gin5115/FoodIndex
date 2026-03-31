import { Link } from 'react-router-dom'
import { Clock, Layers } from 'lucide-react'

export default function FoodCard({ product }) {
  const { _id, name, image, originalPrice, currentPrice, discountPercent, stock, pickupTime, seller, category } = product

  const minutesLeft = Math.max(Math.round((new Date(pickupTime) - Date.now()) / 60000), 0)
  const urgency = minutesLeft <= 60
  const hoursLeft = Math.round(minutesLeft / 60)
  const timeLabel = urgency ? `${minutesLeft}m` : `${hoursLeft}h`

  return (
    <Link to={`/products/${_id}`} className="group block">
      <div className="t-card rounded-xl overflow-hidden shadow-card hover:shadow-raised transition-all duration-200 hover:-translate-y-0.5">

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-[var(--bg-muted)]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Layers size={28} className="t-text-4 opacity-40" />
              <span className="text-xs t-text-4 capitalize">{category}</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
            <span className="bg-orange-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              -{discountPercent}%
            </span>
            {urgency && (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                <Clock size={9} />
                {timeLabel} left
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-3.5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.06em] t-text-4 mb-1 truncate">
            {seller?.businessName || seller?.name}
          </p>
          <h3 className="text-sm font-semibold t-text-1 leading-snug truncate mb-2.5">{name}</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold t-text-1 tracking-tight">₹{currentPrice}</span>
              <span className="text-xs t-text-4 line-through">₹{originalPrice}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] t-text-4">{stock} left</span>
              {!urgency && (
                <p className="text-[10px] t-text-4">
                  {new Date(pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
