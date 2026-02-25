import { Minus, Plus, Trash2, ChevronDown } from 'lucide-react';

function CartItem({ item, onRemove, onUpdateQuantity }) {
    const {
        _id,
        name,
        restaurant,
        image,
        originalPrice = 0,
        quantity = 1,
    } = item;

    // Resolve the actual display price from whichever field is available
    const displayPrice = item.salePrice || item.currentPrice || item.price || originalPrice;
    const itemId = _id || item.id;

    // Calculate discount
    const discountPercent = originalPrice > 0 && displayPrice < originalPrice
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0;

    const handleDecrement = () => {
        if (quantity > 1) {
            onUpdateQuantity(itemId, quantity - 1);
        }
    };

    const handleIncrement = () => {
        onUpdateQuantity(itemId, quantity + 1);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
            {/* Image */}
            <div className="relative flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="aspect-square w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-100 dark:bg-slate-700"
                />
                {discountPercent > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full border border-green-200 dark:border-green-800 shadow-sm whitespace-nowrap">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between gap-3">
                {/* Header Row */}
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {restaurant || item.vendor || 'Local vendor'}
                        </p>
                    </div>
                    <div className="text-right">
                        {discountPercent > 0 && (
                            <p className="text-sm line-through text-gray-400">₹{originalPrice}</p>
                        )}
                        <p className="text-lg font-bold text-primary">₹{displayPrice}</p>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-slate-700 mt-1">
                    <div className="flex items-center gap-3">
                        {/* Pickup/Delivery Select */}
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>Pickup</option>
                                <option>Delivery</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(itemId)}
                            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </button>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-900">
                        <button
                            onClick={handleDecrement}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
