import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Package, ClipboardList, TrendingDown, X, Upload, Pencil, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const STATUS_STYLES = {
  placed:    'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
  ready:     'bg-blue-50 text-blue-600 dark:bg-blue-950/40',
  completed: 'bg-green-50 text-green-600 dark:bg-green-950/40',
  cancelled: 'bg-red-50 text-red-400 dark:bg-red-950/40',
}

const EMPTY_FORM = {
  name: '', description: '', category: 'bread',
  originalPrice: '', stock: '', pickupTime: '', image: '',
}

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold t-text-4 uppercase tracking-wide mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full border t-border t-card rounded-xl px-3.5 py-2.5 text-sm t-text-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState('inventory')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const fileRef = useRef()

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: () => api.get('/products/seller/my').then((r) => r.data),
  })

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: () => api.get('/orders/seller').then((r) => r.data),
    enabled: tab === 'orders',
  })

  const { mutate: createProduct, isPending: creating } = useMutation({
    mutationFn: (data) => api.post('/products', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      setShowForm(false)
      setForm(EMPTY_FORM)
      setFormError('')
    },
    onError: (err) => setFormError(err.response?.data?.message || 'Failed to create listing'),
  })

  const { mutate: deleteProduct } = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller-products'] }),
  })

  const { mutate: updateProduct, isPending: updating } = useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      setEditingId(null)
    },
  })

  const startEdit = (p) => {
    setEditingId(p._id)
    setEditForm({
      stock: p.stock,
      pickupTime: new Date(p.pickupTime).toISOString().slice(0, 16),
      active: p.active,
    })
  }

  const saveEdit = (id) => {
    updateProduct({ id, data: { ...editForm, stock: Number(editForm.stock) } })
  }

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller-orders'] }),
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm((f) => ({ ...f, image: data.url }))
    } catch {
      setFormError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (new Date(form.pickupTime) <= new Date()) {
      setFormError('Pickup time must be in the future')
      return
    }
    createProduct({ ...form, originalPrice: Number(form.originalPrice), stock: Number(form.stock) })
  }

  const totalRevenue = orders.flatMap((o) => o.items).reduce((sum, i) => sum + i.priceAtPurchase * i.qty, 0)

  const TABS = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
  ]

  return (
    <div className="t-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold t-text-1">{user?.businessName}</h1>
          <p className="t-text-4 mt-0.5 capitalize">{user?.businessType}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Listings', value: products.length },
            { label: 'Orders received', value: orders.length },
            { label: 'Total revenue', value: `₹${totalRevenue}`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className={`rounded-lg p-5 ${accent ? 'bg-orange-600' : 'surface'}`}>
              <p className={`text-[10px] uppercase tracking-[0.08em] font-medium mb-3 ${accent ? 'text-orange-200' : 't-text-4'}`}>
                {label}
              </p>
              <p className={`mono text-3xl font-black tracking-tight ${accent ? 'text-white' : 't-text-1'}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] mb-8 gap-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === id
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent t-text-4 hover:t-text-2'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Inventory */}
        {tab === 'inventory' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold t-text-2">Your listings</h2>
              <button
                onClick={() => setShowForm((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  showForm
                    ? 't-muted t-text-2 hover:bg-stone-200 dark:hover:bg-stone-700'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add listing</>}
              </button>
            </div>

            {/* Add form */}
            {showForm && (
              <div className="surface rounded-lg p-6 mb-6">
                <h3 className="font-semibold t-text-1 mb-5">New listing</h3>
                {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Field label="Name">
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls} placeholder="Sourdough loaf" />
                    </Field>
                    <Field label="Category">
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                        {['bread', 'pastry', 'drink', 'snack', 'other'].map((c) => (
                          <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Original price (₹)">
                      <input required type="number" min="1" value={form.originalPrice}
                        onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className={inputCls} placeholder="200" />
                    </Field>
                    <Field label="Stock (portions)">
                      <input required type="number" min="1" value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls} placeholder="10" />
                    </Field>
                    <Field label="Pickup time">
                      <input required type="datetime-local" value={form.pickupTime}
                        onChange={(e) => setForm({ ...form, pickupTime: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Image (optional)">
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          ref={fileRef}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2 border t-border t-card rounded-xl px-3.5 py-2.5 text-sm t-text-2 hover:border-orange-400 hover:text-orange-500 transition-colors disabled:opacity-50 w-full"
                        >
                          <Upload size={13} />
                          {uploading ? 'Uploading...' : form.image ? 'Change image' : 'Upload image'}
                        </button>
                        {form.image && (
                          <img src={form.image} alt="preview" className="w-10 h-10 rounded-lg object-cover shrink-0 border t-border" />
                        )}
                      </div>
                    </Field>
                  </div>
                  <Field label="Description (optional)">
                    <textarea rows={2} value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={inputCls} placeholder="Tell buyers what's in it..." />
                  </Field>
                  <button
                    type="submit"
                    disabled={creating || uploading}
                    className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {creating ? 'Adding...' : 'Add listing'}
                  </button>
                </form>
              </div>
            )}

            {/* Products table */}
            {productsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-14 t-muted rounded-xl animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="surface rounded-lg py-20 text-center t-text-4">
                <Package size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium t-text-3">No listings yet</p>
                <p className="text-sm mt-1">Add your first item above</p>
              </div>
            ) : (
              <div className="surface rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b t-border">
                    <tr className="text-left text-xs font-semibold t-text-4 uppercase tracking-wide">
                      <th className="px-5 py-3.5">Item</th>
                      <th className="px-5 py-3.5">Original</th>
                      <th className="px-5 py-3.5">Live price</th>
                      <th className="px-5 py-3.5">Stock</th>
                      <th className="px-5 py-3.5">Pickup</th>
                      <th className="px-5 py-3.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y t-border">
                    {products.map((p) => {
                      const isEditing = editingId === p._id
                      return (
                        <tr key={p._id} className={`transition-colors ${isEditing ? 'bg-orange-50/50 dark:bg-orange-950/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'}`}>
                          <td className="px-5 py-3.5 font-medium t-text-1 text-sm">
                            <div className="flex items-center gap-2">
                              {p.name}
                              {!p.active && (
                                <span className="text-[10px] font-medium bg-stone-100 dark:bg-stone-800 t-text-4 px-1.5 py-0.5 rounded">
                                  paused
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 t-text-4 line-through text-sm">₹{p.originalPrice}</td>
                          <td className="px-5 py-3.5 mono font-bold text-orange-600 text-sm">₹{p.currentPrice}</td>
                          <td className="px-5 py-3.5 t-text-3 text-sm">
                            {isEditing ? (
                              <input
                                type="number" min="0"
                                value={editForm.stock}
                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                className="w-16 border border-[var(--border)] t-card rounded-md px-2 py-1 text-sm t-text-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            ) : p.stock}
                          </td>
                          <td className="px-5 py-3.5 t-text-4 text-xs">
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                value={editForm.pickupTime}
                                onChange={(e) => setEditForm({ ...editForm, pickupTime: e.target.value })}
                                className="border border-[var(--border)] t-card rounded-md px-2 py-1 text-xs t-text-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            ) : new Date(p.pickupTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-5 py-3.5">
                            {isEditing ? (
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1.5 text-xs t-text-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editForm.active}
                                    onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                                    className="accent-orange-600"
                                  />
                                  Active
                                </label>
                                <button
                                  onClick={() => saveEdit(p._id)}
                                  disabled={updating}
                                  className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 disabled:opacity-50"
                                >
                                  <Check size={13} /> Save
                                </button>
                                <button onClick={() => setEditingId(null)} className="text-xs t-text-4 hover:t-text-2">
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => startEdit(p)}
                                  className="t-text-4 hover:t-text-2 transition-colors"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => { if (window.confirm('Remove this listing?')) deleteProduct(p._id) }}
                                  className="t-text-4 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <>
            <h2 className="font-semibold t-text-2 mb-5">Incoming orders</h2>
            {ordersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 t-muted rounded-2xl animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="surface rounded-lg py-20 text-center t-text-4">
                <ClipboardList size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium t-text-3">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="surface rounded-lg p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold t-text-1">{order.buyer?.name}</p>
                        <p className="text-xs t-text-4">{order.buyer?.email}</p>
                        <p className="text-xs t-text-4 mt-0.5">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="mono font-bold t-text-1 mb-1.5">₹{order.total}</p>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus({ id: order._id, status: e.target.value })}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border-0 capitalize cursor-pointer ${STATUS_STYLES[order.status]}`}
                        >
                          {['placed', 'ready', 'completed', 'cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {order.items.map((item, i) => (
                        <span key={i} className="t-muted rounded-lg px-3 py-1.5 text-xs t-text-2 font-medium">
                          {item.name} ×{item.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
