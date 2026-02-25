import { Banknote, ShoppingBag, Recycle, Percent, TrendingUp } from 'lucide-react';

const defaultMetrics = [
    {
        id: 'revenue',
        label: "Today's Revenue",
        value: '₹4,250',
        icon: Banknote,
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        trend: '+12%',
    },
    {
        id: 'items',
        label: 'Items Sold',
        value: '47',
        icon: ShoppingBag,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        id: 'food',
        label: 'Food Saved',
        value: '8.2 kg',
        icon: Recycle,
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
        id: 'discount',
        label: 'Avg Discount',
        value: '42%',
        icon: Percent,
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
];

function BusinessMetrics({ metrics = defaultMetrics }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                    <div
                        key={metric.id}
                        className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                            </div>
                            {metric.trend && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {metric.trend}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                            {metric.label}
                        </p>
                        <p className="text-gray-900 dark:text-white text-2xl font-bold">
                            {metric.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default BusinessMetrics;
