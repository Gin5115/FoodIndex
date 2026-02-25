import { PiggyBank } from 'lucide-react';

function SavingsHighlight({ amount }) {
    return (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg p-3 flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-1.5 flex items-center justify-center text-green-600 dark:text-green-300">
                <PiggyBank className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                    You saved ₹{amount}!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                    Great deal on your order
                </p>
            </div>
        </div>
    );
}

export default SavingsHighlight;
