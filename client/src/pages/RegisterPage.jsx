import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, User, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const inputCls = 'w-full border border-[var(--border)] t-card t-text-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500/50 placeholder:t-text-4 transition-colors'

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium t-text-3 mb-2">{label}</label>
    <input {...props} className={inputCls} />
  </div>
)

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isSeller, setIsSeller] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    businessName: '', businessType: 'restaurant', businessAddress: '', phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { ...form, isSeller })
      login(data.user, data.token)
      navigate(isSeller ? '/dashboard/business' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
            Join the<br />food rescue.
          </p>
          <p className="text-[#666] text-sm leading-relaxed">
            Whether you're buying discounted meals or listing surplus food — FoodIndex connects you.
          </p>
        </div>
        <p className="text-[#333] text-xs">MACSE640 · Full Stack Development</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xs">
          <div className="mb-6">
            <h1 className="text-2xl font-black t-text-1 tracking-tight mb-1">Create account</h1>
            <p className="t-text-4 text-sm">Get started in under a minute</p>
          </div>

          {/* Role toggle */}
          <div className="flex t-muted rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsSeller(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                !isSeller ? 't-card t-text-1 shadow-card' : 't-text-4 hover:t-text-2'
              }`}
            >
              <User size={13} />
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setIsSeller(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                isSeller ? 't-card t-text-1 shadow-card' : 't-text-4 hover:t-text-2'
              }`}
            >
              <Building2 size={13} />
              Seller
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Jane Doe" />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" />

            {isSeller && (
              <>
                <Input label="Business name" type="text" name="businessName" value={form.businessName} onChange={handleChange} required placeholder="The Corner Bakery" />

                <div>
                  <label className="block text-xs font-medium t-text-3 mb-2">Business type</label>
                  <select
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    {['restaurant', 'cafe', 'bakery', 'other'].map((t) => (
                      <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <Input label="Business address" type="text" name="businessAddress" value={form.businessAddress} onChange={handleChange} required placeholder="123 Main St, City" />
                <Input label="Phone (optional)" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-full font-medium text-sm transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-xs t-text-4 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-medium hover:text-orange-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
