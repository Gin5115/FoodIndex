import { useState } from 'react';
import { X, Loader2, ImagePlus } from 'lucide-react';

function AddItemModal({ isOpen, onClose, onItemAdded, token }) {
    const [formData, setFormData] = useState({
        name: '',
        restaurant: '',
        category: 'General',
        originalPrice: '',
        currentPrice: '',
        stock: '10',
        pickupTime: '22:00',
        image: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['General', 'Pizza', 'Burger', 'Dessert', 'Pastry', 'Healthy', 'Main Course', 'Beverage', 'Indian', 'Chinese'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name.trim()) return setError('Product name is required');
        if (!formData.originalPrice || Number(formData.originalPrice) <= 0) return setError('Original price must be positive');
        if (!formData.currentPrice || Number(formData.currentPrice) <= 0) return setError('Sale price must be positive');
        if (Number(formData.currentPrice) > Number(formData.originalPrice)) return setError('Sale price cannot exceed original price');

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    restaurant: formData.restaurant.trim() || undefined,
                    category: formData.category,
                    originalPrice: Number(formData.originalPrice),
                    currentPrice: Number(formData.currentPrice),
                    stock: Number(formData.stock) || 10,
                    pickupTime: formData.pickupTime,
                    image: formData.image.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Reset form
                setFormData({
                    name: '', restaurant: '', category: 'General',
                    originalPrice: '', currentPrice: '', stock: '10',
                    pickupTime: '22:00', image: '',
                });
                onItemAdded?.(data);
                onClose();
            } else {
                setError(data.message || 'Failed to create product');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Item</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Margherita Pizza"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Restaurant + Category Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Restaurant / Store
                            </label>
                            <input
                                type="text"
                                name="restaurant"
                                value={formData.restaurant}
                                onChange={handleChange}
                                placeholder="Your store name"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pricing Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Original Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                min="1"
                                placeholder="399"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Sale Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="currentPrice"
                                value={formData.currentPrice}
                                onChange={handleChange}
                                min="1"
                                placeholder="199"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Discount Preview */}
                    {formData.originalPrice && formData.currentPrice && Number(formData.currentPrice) <= Number(formData.originalPrice) && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800/30">
                            <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                {Math.round(((Number(formData.originalPrice) - Number(formData.currentPrice)) / Number(formData.originalPrice)) * 100)}% discount
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-500">
                                — Customers save ₹{Number(formData.originalPrice) - Number(formData.currentPrice)}
                            </span>
                        </div>
                    )}

                    {/* Stock + Pickup Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                placeholder="10"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Pickup Time
                            </label>
                            <input
                                type="time"
                                name="pickupTime"
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Image URL
                        </label>
                        <div className="relative">
                            <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Add to Inventory'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddItemModal;
