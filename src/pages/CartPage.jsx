import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Sun, Moon, ArrowLeftCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import Footer from '../components/layout/Footer';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';

function CartPage() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { cartItems, removeFromCart, updateQuantity, cartTotal, placeOrder } = useFood();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Calculate totals
    const subtotal = cartTotal;
    const serviceFee = cartItems.length > 0 ? 20 : 0;
    const discount = 0;
    const total = subtotal + serviceFee - discount;
    const savings = cartItems.reduce((sum, item) => {
        const original = item.originalPrice || 0;
        const current = item.salePrice || item.currentPrice || item.price || 0;
        return sum + ((original - current) * item.quantity);
    }, 0);

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        updateQuantity(id, newQuantity);
    };

    const handleCheckout = async () => {
        // Check if user is logged in
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        setIsCheckingOut(true);
        const result = await placeOrder(user.token);
        setIsCheckingOut(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
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
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                            Your Cart ({cartItems.length} items)
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base">
                            Review your selected items before checkout.
                        </p>
                    </div>
                    <Link
                        to="/marketplace"
                        className="text-primary font-bold hover:underline flex items-center gap-1 group"
                    >
                        <ArrowLeftCircle className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Continue Shopping
                    </Link>
                </div>

                {/* Cart Layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Cart Items Column */}
                    <div className="flex flex-col flex-1 gap-4 w-full lg:w-[70%]">
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <CartItem
                                    key={item.id || item._id}
                                    item={item}
                                    onRemove={handleRemove}
                                    onUpdateQuantity={handleUpdateQuantity}
                                />
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-800 p-12 rounded-xl text-center border-2 border-dashed border-gray-200 dark:border-slate-700">
                                <div className="text-5xl mb-4">🛒</div>
                                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">Your cart is empty</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Browse deals and add items to get started.</p>
                                <Link to="/marketplace" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-all">
                                    Browse Deals
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Column */}
                    {cartItems.length > 0 && (
                        <div className="w-full lg:w-[30%]">
                            <OrderSummary
                                subtotal={subtotal}
                                serviceFee={serviceFee}
                                discount={discount}
                                total={total}
                                savings={savings}
                                onCheckout={handleCheckout}
                                isCheckingOut={isCheckingOut}
                            />
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default CartPage;
