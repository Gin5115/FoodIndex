import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Sun, Moon, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';

// Shared NavLink styling with active underline — adapts to light/dark
const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 py-1 ${isActive
        ? 'text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
        : 'text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
    }`;

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { cartCount } = useFood();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f0a19]/90 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/[0.06] shadow-sm dark:shadow-lg dark:shadow-black/10">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-4 lg:px-8 h-16">
                {/* ── Logo ─────────────────────────────── */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15 p-1.5 text-primary group-hover:bg-primary/20 dark:group-hover:bg-primary/25 transition-colors">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <span className="text-primary">Food</span>Index
                    </span>
                </Link>

                {/* ── Desktop Navigation ────────────────── */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Nav links */}
                    <nav className="flex items-center gap-6">
                        <NavLink to="/marketplace" className={navLinkClass}>Marketplace</NavLink>
                        <NavLink to="/business" className={navLinkClass}>For Business</NavLink>

                        {user && (
                            <NavLink to="/dashboard" className={navLinkClass}>My Orders</NavLink>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.14] hover:text-gray-700 dark:hover:text-white transition-all"
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {user ? (
                            <>
                                {/* Cart */}
                                <Link
                                    to="/cart"
                                    className="relative flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.14] hover:text-gray-700 dark:hover:text-white transition-all"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0f0a19]">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-full bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.14] transition-all"
                                    >
                                        <div className="flex items-center justify-center size-7 rounded-full bg-primary/20 dark:bg-primary/30 text-primary font-bold text-xs">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-white/80 hidden lg:block max-w-[100px] truncate">
                                            {user.name}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-white/40 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {isProfileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-[#1a1425] border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/40 py-1.5 z-50">
                                                <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 dark:text-white/40 truncate">{user.email}</p>
                                                </div>
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <Link
                                                    to="/cart"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Cart
                                                    {cartCount > 0 && <span className="ml-auto text-xs text-primary font-bold">{cartCount}</span>}
                                                </Link>
                                                <div className="border-t border-gray-100 dark:border-white/[0.06] mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/[0.06] transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" /> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="text-sm font-medium text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Login
                                </NavLink>
                                <Link
                                    to="/signup"
                                    className="flex items-center justify-center h-9 px-5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all active:scale-95"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Mobile Controls ───────────────────── */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {user && (
                        <Link
                            to="/cart"
                            className="relative flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#0f0a19]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    <button
                        className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-700 dark:text-white/70"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ──────────────────────────── */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200/60 dark:border-white/[0.06] bg-white/98 dark:bg-[#0f0a19]/98 backdrop-blur-xl">
                    <nav className="flex flex-col px-4 py-3 gap-1">
                        <NavLink
                            to="/marketplace"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white'
                                }`
                            }
                        >
                            Marketplace
                        </NavLink>
                        <NavLink
                            to="/business"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white'
                                }`
                            }
                        >
                            For Business
                        </NavLink>

                        {user ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white'
                                        }`
                                    }
                                >
                                    My Orders
                                </NavLink>

                                <div className="border-t border-gray-200/60 dark:border-white/[0.06] mt-2 pt-2">
                                    <div className="px-3 py-2 text-xs text-gray-400 dark:text-white/30 font-medium uppercase tracking-wider">
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.06] transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-gray-200/60 dark:border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-colors text-center"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;
