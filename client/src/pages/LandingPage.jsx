import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TrendingDown, ShoppingBag, ArrowRight, Clock, Leaf, MapPin } from 'lucide-react'
import api from '../lib/api'
import FoodCard from '../components/FoodCard'

const TICKER_ITEMS = [
  'Croissants', 'Biryani Box', 'Cold Brew', 'Sourdough', 'Thali',
  'Avocado Toast', 'Trail Mix', 'Cinnamon Danish', 'Noodle Bowl',
  'Cupcakes', 'Sandwiches', 'Cheesecake', 'Wraps', 'Donuts',
]

const PRICING_FACTORS = [
  { label: 'Time decay', pct: 40, desc: 'Price falls as pickup time approaches' },
  { label: 'Stock pressure', pct: 30, desc: 'More stock = deeper discounts' },
  { label: 'Demand signal', pct: 20, desc: 'Views and watchers shift the price' },
  { label: 'Urgency boost', pct: 10, desc: 'Final hour sees the steepest cuts' },
]

const PRICE_TIMELINE = [
  { time: '3h left', price: 200 },
  { time: '2h left', price: 155 },
  { time: '1h left', price: 105 },
  { time: '30m left', price: 68, active: true },
]

export default function LandingPage() {
  const { data: trending = [] } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.get('/products').then((r) => r.data.slice(0, 4)),
  })

  return (
    <div className="t-bg">

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 mb-8 tracking-wide uppercase">
            <Leaf size={12} />
            Hyper-local food rescue
          </div>

          <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-black t-text-1 leading-[1.02] tracking-[-0.03em] mb-6">
            Great food.<br />
            <span className="text-orange-600">Rescued prices.</span>
          </h1>

          <p className="text-lg t-text-3 max-w-xl leading-relaxed mb-10">
            Restaurants near you list surplus food at prices that drop automatically
            as pickup time approaches. You save. They cut waste.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors"
            >
              Browse deals <ArrowRight size={15} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 t-card t-text-2 px-6 py-3 rounded-full font-medium text-sm transition-colors shadow-card hover:shadow-raised border border-[var(--border)]"
            >
              List your food
            </Link>
          </div>
        </div>

        {/* Quick stats — inline, no chips */}
        <div className="mt-16 flex gap-10 flex-wrap border-t border-[var(--border)] pt-10">
          {[
            { value: '70%', label: 'Max discount' },
            { value: 'Live', label: 'Price updates' },
            { value: '0', label: 'Food wasted' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black t-text-1 tracking-tight">{value}</p>
              <p className="text-sm t-text-4 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="border-y border-[var(--border)] t-card py-3 overflow-hidden">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-3 px-6 text-sm t-text-4 whitespace-nowrap">
              {item}
              <span className="w-1 h-1 rounded-full bg-[var(--border-md)] inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── How it works — editorial numbered list ── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-black t-text-1 tracking-tight leading-tight mb-4">
              From listing to<br />pickup in minutes
            </h2>
            <p className="t-text-3 leading-relaxed">
              Sellers list surplus. Prices adjust in real time. You order and collect.
              No subscriptions. No fees.
            </p>
          </div>
          <ol className="space-y-8">
            {[
              { icon: MapPin, title: 'Find nearby food', desc: 'Discover surplus meals and pastries from restaurants and cafes around you.' },
              { icon: TrendingDown, title: 'Watch prices drop', desc: 'Our algorithm adjusts prices live as pickup time approaches. Later = cheaper.' },
              { icon: ShoppingBag, title: 'Order and collect', desc: 'Pay online, collect in store. Food rescued, money saved, waste eliminated.' },
            ].map((step, i) => (
              <li key={i} className="flex gap-5">
                <span className="text-4xl font-black text-[var(--border)] tabular-nums leading-none mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold t-text-1 mb-1">{step.title}</h3>
                  <p className="text-sm t-text-3 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Pricing section — always dark ── */}
      <section className="bg-[#111111] py-24 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-[0.1em] mb-4">
              Live pricing engine
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-5">
              Prices that reflect reality, every second
            </h2>
            <p className="text-[#888] leading-relaxed mb-12 text-sm">
              No cron jobs. No stale prices. Our 4-factor algorithm recomputes
              the exact price every time a product is fetched.
            </p>
            <div className="space-y-5">
              {PRICING_FACTORS.map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-white">{f.label}</span>
                    <span className="text-xs text-[#555]">{f.desc}</span>
                  </div>
                  <div className="h-[3px] bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full"
                      style={{ width: `${f.pct * 1.4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price timeline */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
            <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Example</p>
            <p className="text-sm font-medium text-white mb-6">Sourdough Loaf — Original ₹200</p>
            <div className="space-y-2">
              {PRICE_TIMELINE.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                    row.active ? 'bg-orange-600' : 'bg-[#222]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={12} className={row.active ? 'text-orange-100' : 'text-[#555]'} />
                    <span className={`text-sm ${row.active ? 'text-white font-medium' : 'text-[#666]'}`}>
                      {row.time}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold ${row.active ? 'text-white text-lg' : 'text-[#555]'}`}>
                      ₹{row.price}
                    </span>
                    {row.active && (
                      <span className="text-xs text-orange-200 font-medium">
                        -{Math.round(((200 - row.price) / 200) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#444] text-center mt-5">
              Maximum 70% off — 30% seller margin always protected
            </p>
          </div>
        </div>
      </section>

      {/* ── Trending now ── */}
      {trending.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black t-text-1 tracking-tight">Ending soon</h2>
              <p className="t-text-4 mt-1 text-sm">Grab these before they're gone</p>
            </div>
            <Link
              to="/marketplace"
              className="hidden md:flex items-center gap-1 text-sm t-text-3 hover:t-text-1 transition-colors"
            >
              All deals <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((p) => <FoodCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Footer CTA ── */}
      <section className="border-t border-[var(--border)] max-w-6xl mx-auto px-5 py-20">
        <div className="flex flex-col md:flex-row md:items-center gap-8 justify-between">
          <div>
            <h2 className="text-3xl font-black t-text-1 tracking-tight mb-2">
              Ready to rescue some food?
            </h2>
            <p className="t-text-3 text-sm">
              Join buyers saving money and sellers cutting waste.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors whitespace-nowrap"
            >
              Get started free
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 t-card border border-[var(--border)] t-text-2 px-6 py-3 rounded-full font-medium text-sm transition-colors shadow-card hover:shadow-raised whitespace-nowrap"
            >
              Browse deals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-8 px-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold t-text-1">
            Food<span className="text-orange-600">Index</span>
          </span>
          <p className="text-xs t-text-4">MACSE640 Course Project</p>
        </div>
      </footer>
    </div>
  )
}
