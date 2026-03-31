import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, LayoutDashboard, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }
  const isActive = (path) => location.pathname === path

  const navLink = (path) =>
    `text-sm transition-colors ${
      isActive(path)
        ? 'text-orange-600 dark:text-orange-400 font-medium'
        : 'text-[var(--text-3)] hover:text-[var(--text-1)]'
    }`

  return (
    <nav className="sticky top-0 z-50 t-bg border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-6">

        {/* Wordmark */}
        <Link to="/" className="shrink-0 text-[15px] font-bold tracking-tight t-text-1">
          Food<span className="text-orange-600">Index</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <Link to="/marketplace" className={navLink('/marketplace')}>Marketplace</Link>

          {user && (
            <Link
              to={user.isSeller ? '/dashboard/business' : '/dashboard'}
              className={navLink(user.isSeller ? '/dashboard/business' : '/dashboard')}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              {!user.isSeller && (
                <Link to="/cart" className="relative p-2 rounded-lg t-text-3 hover:t-text-1 transition-colors">
                  <ShoppingBag size={17} />
                  {itemCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-orange-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg t-text-4 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm t-text-3 hover:t-text-1 transition-colors px-3 py-1.5">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                Get started
              </Link>
            </>
          )}

          <button
            onClick={toggle}
            className="p-2 ml-1 rounded-lg t-text-4 hover:t-text-2 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1">
          <button onClick={toggle} className="p-2 rounded-lg t-text-4 transition-colors">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg t-text-3 transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] t-bg px-5 py-3 space-y-0.5">
          <Link to="/marketplace" onClick={() => setMenuOpen(false)}
            className="block py-2.5 text-sm t-text-2 hover:t-text-1">Marketplace</Link>
          {user ? (
            <>
              <Link
                to={user.isSeller ? '/dashboard/business' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm t-text-2 hover:t-text-1"
              >
                Dashboard
              </Link>
              {!user.isSeller && (
                <Link to="/cart" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-sm t-text-2 hover:t-text-1">
                  Cart
                  {itemCount > 0 && (
                    <span className="bg-orange-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2.5 text-sm text-red-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm t-text-2 hover:t-text-1">Sign in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-orange-600">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
