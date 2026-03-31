import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-stone-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg">
      <p className="font-bold">₹{d.price}</p>
      <p className="text-stone-400">{d.label}</p>
      {d.reason && <p className="text-orange-400 mt-0.5">{d.reason}</p>}
    </div>
  )
}

export default function PriceChart({ priceHistory, originalPrice, currentPrice }) {
  if (!priceHistory?.length && !currentPrice) return null

  const points = [
    ...priceHistory.map((h) => ({
      price: h.price,
      label: new Date(h.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason: h.reason,
      time: new Date(h.recordedAt).getTime(),
    })),
    {
      price: currentPrice,
      label: 'Now',
      reason: 'live price',
      time: Date.now(),
    },
  ].sort((a, b) => a.time - b.time)

  const minPrice = Math.min(...points.map((p) => p.price)) * 0.9
  const maxPrice = originalPrice * 1.05

  return (
    <div>
      <p className="text-xs font-semibold t-text-4 uppercase tracking-widest mb-4">Price over time</p>
      <div className="t-card rounded-2xl border t-border p-4">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={points} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#a8a29e' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: '#a8a29e' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={originalPrice}
              stroke="#57534e"
              strokeDasharray="4 4"
              label={{ value: `Original ₹${originalPrice}`, fontSize: 9, fill: '#a8a29e', position: 'insideTopRight' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={{ fill: '#f97316', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#f97316', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
