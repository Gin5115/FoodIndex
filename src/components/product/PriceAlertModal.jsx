import { useState } from 'react';
import { X, TrendingDown, AlertTriangle } from 'lucide-react';

function PriceAlertModal({ isOpen, onClose, currentPrice = 89, predictedLow = 75, predictedTime = '6:45 PM' }) {
    const [targetPrice, setTargetPrice] = useState('');

    // Quick select prices
    const quickPrices = [75, 60, 45];

    const handleQuickSelect = (price) => {
        setTargetPrice(price.toString());
    };

    const handleSubmit = () => {
        if (targetPrice) {
            console.log('Alert set for:', targetPrice);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Set Price Alert
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Body Content */}
                    <div className="px-6 py-4 flex flex-col gap-5">
                        {/* Current Price Block */}
                        <div className="flex flex-col items-center justify-center bg-primary/5 dark:bg-primary/10 rounded-xl py-4 border border-primary/10">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Current Price
                            </span>
                            <div className="text-primary text-4xl font-bold tracking-tighter mt-1">
                                ₹{currentPrice}
                            </div>
                        </div>

                        {/* Target Price Input Section */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                                htmlFor="target-price"
                            >
                                Notify me when price drops to
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-semibold text-lg">₹</span>
                                </div>
                                <input
                                    id="target-price"
                                    type="number"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(e.target.value)}
                                    placeholder="Enter amount"
                                    className="block w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Quick Select Chips */}
                        <div className="flex gap-2.5">
                            {quickPrices.map((price) => (
                                <button
                                    key={price}
                                    onClick={() => handleQuickSelect(price)}
                                    className={`flex-1 py-2 px-3 rounded-lg border font-semibold text-sm transition-colors ${targetPrice === price.toString()
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-primary/5 dark:bg-primary/10 text-primary dark:text-purple-300 border-primary/20 dark:border-purple-800 hover:bg-primary/10 dark:hover:bg-primary/20'
                                        }`}
                                >
                                    ₹{price}
                                </button>
                            ))}
                        </div>

                        {/* Prediction Box */}
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
                            <TrendingDown className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                                    Prediction
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                                    Likely to reach <span className="font-bold">₹{predictedLow}</span> by {predictedTime}
                                </p>
                            </div>
                        </div>

                        {/* Urgency Warning */}
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium leading-snug">
                                Item might sell out before reaching your target price.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 pt-2 grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!targetPrice}
                            className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            Set Alert
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PriceAlertModal;
