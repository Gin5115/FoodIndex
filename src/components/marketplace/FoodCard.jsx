import { Link } from 'react-router-dom';
import { Plus, Star, Clock, MapPin } from 'lucide-react';

function FoodCard({ item }) {
    const {
        _id,
        name,
        restaurant,
        rating,
        image,
        originalPrice = 0,
        stock = 0,
    } = item;

    // Use currentPrice with fallback
    const currentPrice = item.currentPrice || item.salePrice || item.price || originalPrice;

    // Calculate discount percentage (guard against NaN/Infinity)
    const discountPercent = originalPrice > 0
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0;

    // Format time remaining from expiryTime or pickupTime
    const getFormattedTime = () => {
        if (item.expiryTime) {
            const diff = new Date(item.expiryTime) - new Date();
            if (diff <= 0) return 'Expired';
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (hours > 0) return `${hours}h ${mins}m left`;
            return `${mins}m left`;
        }
        if (item.pickupTime) return `By ${item.pickupTime}`;
        return null;
    };

    const formattedTime = item.formattedTime || getFormattedTime();

    // Determine stock status
    const currentStock = item.currentStock || stock;
    const stockStatus = currentStock < 5 ? 'Almost Gone' : currentStock < 20 ? 'Selling Fast' : 'Available';
    const stockPercent = Math.min(100, Math.max(0, (currentStock / (item.initialStock || 50)) * 100));

    const getStockStatusColor = () => {
        if (currentStock < 5) return 'text-red-500 dark:text-red-400';
        if (currentStock < 20) return 'text-orange-500 dark:text-orange-400';
        return 'text-green-600 dark:text-green-400';
    };

    return (
        <Link to={`/product/${_id}`} className="group flex flex-col rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 cursor-pointer h-full">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                {discountPercent > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 backdrop-blur-sm">
                            -{discountPercent}%
                        </span>
                    </div>
                )}

                {formattedTime && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 backdrop-blur-sm shadow-sm gap-1">
                            <Clock className="w-3 h-3" />
                            {formattedTime}
                        </span>
                    </div>
                )}

                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${image}')` }}
                />

                {/* Distance Badge */}
                {item.distance && (
                    <div className="absolute bottom-3 left-3 z-10">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/10 gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            {item.distance} km
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-1">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                            <span className="line-clamp-1 max-w-[120px]">{restaurant}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 font-medium text-gray-900 dark:text-gray-300">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {rating || 4.5}
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center justify-center size-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex-shrink-0">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-auto pt-2">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-medium ${getStockStatusColor()}`}>
                            {stockStatus}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {currentStock} left
                        </span>
                    </div>

                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${stockPercent}%` }}
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-extrabold text-primary">₹{currentPrice}</span>
                        {discountPercent > 0 && (
                            <span className="text-sm text-gray-400 line-through font-medium mb-1.5">
                                ₹{originalPrice}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default FoodCard;
