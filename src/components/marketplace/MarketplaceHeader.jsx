import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Leaf, Sun, Moon, ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';

function MarketplaceHeader() {
    const [searchQuery, setSearchQuery] = useState('');
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { cartCount, userLocation } = useFood();

    // Derive location string
    const locationDisplay = userLocation
        ? 'around you'
        : 'near you';

    return (
        <div className="sticky top-0 z-40 w-full">
            {/* Row 1: Main Navbar */}
            <nav className="flex items-center justify-between gap-4 px-4 lg:px-8 py-3 bg-white/95 dark:bg-[#0f0a19]/95 backdrop-blur-md border-b border-gray-200/60 dark:border-white/[0.06]">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15 p-2 text-primary">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight hidden sm:block">
                        <span className="text-primary">Food</span><span className="text-gray-900 dark:text-white">Index</span>
                    </h1>
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
                    <div className="relative w-full">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${locationDisplay}...`}
                            className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.06] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-200/60 dark:bg-white/[0.06] text-gray-400 dark:text-white/40 hover:text-primary transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right: Navigation + Actions */}
                <div className="flex items-center gap-4">
                    {/* Navigation Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link to="/marketplace" className="text-primary text-sm font-bold">
                            Deals
                        </Link>
                        <Link to="/marketplace" className="text-gray-500 dark:text-white/60 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
                            Explore
                        </Link>
                        <Link to="/dashboard" className="text-gray-500 dark:text-white/60 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
                            My Orders
                        </Link>
                    </div>

                    {/* Cart Icon */}
                    <Link
                        to="/cart"
                        className="relative flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.14] hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0f0a19]">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.14] hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* Profile / Login */}
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-bold text-sm hover:bg-primary/30 transition-colors"
                            title={`Dashboard (${user.name})`}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            {/* Row 2: Available Deals Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 lg:px-8 py-4 bg-white/90 dark:bg-[#0f0a19]/90 backdrop-blur-md border-b border-gray-200/60 dark:border-white/[0.06]">
                {/* Left: Title */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Available Deals
                    </h2>
                    <p className="text-sm text-gray-400 dark:text-white/40 mt-0.5">
                        Showing available items near you
                    </p>
                </div>

                {/* Right: Filter & Sort Buttons */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-gray-100 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.06] text-sm font-medium text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-gray-100 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.06] text-sm font-medium text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowUpDown className="w-4 h-4" />
                        Sort by
                    </button>
                </div>
            </div>

            {/* Mobile Search (Visible on small screens) */}
            <div className="sm:hidden px-4 py-3 bg-white/95 dark:bg-[#0f0a19]/95 backdrop-blur-md border-b border-gray-200/60 dark:border-white/[0.06]">
                <div className="relative flex items-center">
                    <MapPin className="absolute left-3 w-4 h-4 text-primary" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search in ${location}...`}
                        className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.06] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
            </div>
        </div>
    );
}

export default MarketplaceHeader;
