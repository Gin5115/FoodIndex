import { Link } from 'react-router-dom';
import { ArrowRight, Info, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import SavingsHighlight from './SavingsHighlight';

function OrderSummary({ subtotal, serviceFee, discount, total, savings, onCheckout, isCheckingOut }) {
    return (
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            {/* Main Summary Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Order Summary
                </h2>

                {/* Line Items */}
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                            <span>Service Fee</span>
                            <Info className="w-4 h-4 text-gray-400 cursor-help" title="Platform fee for maintenance" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">₹{serviceFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
                        <span>Discount</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-₹{discount}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-slate-700 mb-4"></div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-black text-primary">₹{total}</span>
                </div>

                {/* Savings Highlight */}
                <div className="mb-6">
                    <SavingsHighlight amount={savings} />
                </div>

                {/* Checkout Button */}
                <button
                    onClick={onCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                    {isCheckingOut ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Placing Order...
                        </>
                    ) : (
                        <>
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {/* Price Update Notice */}
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    Prices update every 15 mins
                </p>
            </div>

            {/* Security Badge */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Secure Transaction</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your personal data is protected.</p>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
