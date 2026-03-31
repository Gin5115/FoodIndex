import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const inputCls = 'w-full border border-[var(--border)] t-card t-text-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500/50 placeholder:t-text-4 transition-colors'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.user, data.token)
      navigate(data.user.isSeller ? '/dashboard/business' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen t-bg flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#111111] p-12">
        <Link to="/" className="text-[15px] font-bold text-white tracking-tight">
          Food<span className="text-orange-500">Index</span>
        </Link>
        <div>
          <p className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
            Food rescue,<br />done right.
          </p>
          <p className="text-[#666] text-sm leading-relaxed">
            Prices that drop in real time.<br />Surplus food that finds a home.
          </p>
        </div>
        <p className="text-[#333] text-xs">MACSE640 · Full Stack Development</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xs">
          <div className="mb-8">
            <h1 className="text-2xl font-black t-text-1 tracking-tight mb-1">Welcome back</h1>
            <p className="t-text-4 text-sm">Sign in to continue</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-5 text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium t-text-3 mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium t-text-3 mb-2">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••" className={inputCls} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-full font-medium text-sm transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs t-text-4 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 font-medium hover:text-orange-700">
              Get started free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
