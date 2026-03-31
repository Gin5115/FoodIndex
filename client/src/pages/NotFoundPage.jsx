import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="t-bg min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-8xl font-extrabold t-border-md mb-2" style={{ WebkitTextStroke: '2px var(--border-md)', color: 'transparent' }}>404</p>
        <h1 className="text-2xl font-bold t-text-1 mb-2">Page not found</h1>
        <p className="t-text-3 text-sm mb-8">This page doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    </div>
  )
}
