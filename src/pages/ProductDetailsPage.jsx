import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Star, Share2, Heart, ShoppingBag, Store, ChevronRight, Info, Utensils, Plus, Loader2, TrendingDown, Bell, Leaf, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFood } from '../context/FoodContext';
import PriceChart from '../components/product/PriceChart';
import PriceAlertModal from '../components/product/PriceAlertModal';
import Footer from '../components/layout/Footer';

function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { addToCart } = useFood();
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [nextDrop, setNextDrop] = useState(null);

    // API State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Track view when user visits product page
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch(`http://localhost:5000/api/products/${id}/view`, { method: 'POST' });
            } catch (error) {
                // Non-critical — silently ignore
            }
        };
        if (id) trackView();
    }, [id]);

    // Fetch next price drop info
    useEffect(() => {
        const fetchNextDrop = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}/next-drop`);
                if (res.ok) {
                    const data = await res.json();
                    setNextDrop(data.nextDrop);
                }
            } catch (error) {
                // Non-critical
            }
        };
        if (id) fetchNextDrop();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
    };

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (error) return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-red-500">Error: {error}</div>;
    if (!product) return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-500">Product not found</div>;

    const discountPercentage = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-display transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 py-3 bg-white/95 dark:bg-[#0f0a19]/95 backdrop-blur-md border-b border-gray-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-4">
                    <Link
                        to="/marketplace"
                        className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.14] hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15 p-1.5 text-primary">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            <span className="text-primary">Food</span>Index
                        </h1>
                    </Link>
                </div>
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.14] hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
                    <span>›</span>
                    <span>{product.category || 'Category'}</span>
                    <span>›</span>
                    <span className="text-primary font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Product Info */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Product Image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                            <span className="absolute top-4 left-4 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md">
                                {discountPercentage}% OFF
                            </span>
                        </div>

                        {/* Product Details Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {product.name}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                {product.restaurant} • {product.category}
                            </p>

                            {/* Pricing */}
                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    ₹{product.currentPrice}
                                </span>
                                <div className="flex flex-col mb-1">
                                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                    <span className="text-sm font-bold text-green-600">-{discountPercentage}%</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                        <TrendingDown className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Trend</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">Dropping</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Pickup By</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {product.pickupTime || '9:00 PM'}
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="p-6 border-t border-gray-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">Total Price</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.currentPrice}</div>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 active:scale-[0.98]"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Alert Card */}
                        <div className="bg-gradient-to-br from-primary/5 to-purple-50 dark:from-primary/10 dark:to-purple-900/20 rounded-xl p-6 border border-primary/10">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-primary">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                        Set Price Alert
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                        Get notified when the price drops further.
                                    </p>
                                    <button
                                        onClick={() => setIsAlertModalOpen(true)}
                                        className="text-primary text-sm font-bold hover:underline"
                                    >
                                        Create Alert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Price Chart + Extra Info */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <PriceChart product={product} />

                        {/* Store Info + Deal Highlights row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Store Info */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Store className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{product.restaurant}</h3>
                                        <p className="text-xs text-gray-400">{product.category} Specialist</p>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>0.8 km away • {product.restaurant}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                        <span>4.5 rating • 320+ orders</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>Pickup by <strong>{product.pickupTime || '9:00 PM'}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Deal Highlights */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-primary" />
                                    Deal Highlights
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-50 dark:bg-green-900/15 rounded-lg p-3 text-center">
                                        <p className="text-xl font-black text-green-600 dark:text-green-400">
                                            ₹{product.originalPrice - product.currentPrice}
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">You Save</p>
                                    </div>
                                    <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 text-center">
                                        <p className="text-xl font-black text-primary">
                                            {discountPercentage}%
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Discount</p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/15 rounded-lg p-3 text-center">
                                        <p className="text-xl font-black text-amber-600 dark:text-amber-400">{product.currentStock || product.stock || '–'}</p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Left in Stock</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/15 rounded-lg p-3 text-center">
                                        <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                                            {product.pickupTime || '9 PM'}
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Pickup Window</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-400" />
                                About This Deal
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                {product.description || `Fresh ${product.name} from ${product.restaurant}, available at a ${discountPercentage}% discount. Originally priced at ₹${product.originalPrice}, now available for ₹${product.currentPrice}. Pick up before ${product.pickupTime || '9:00 PM'} today to enjoy this deal and help reduce food waste.`}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[product.category, 'Fresh', 'Limited', 'Eco-Friendly'].map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Price Alert Modal */}
            <PriceAlertModal
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                currentPrice={product.currentPrice}
                predictedLow={nextDrop ? nextDrop.price : Math.floor(product.currentPrice * 0.8)}
                predictedTime={nextDrop ? new Date(nextDrop.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '7:00 PM'}
            />
        </div>
    );
}

export default ProductDetailsPage;
