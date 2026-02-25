import { ShoppingBag, PiggyBank, Utensils, TreePine } from 'lucide-react';

const defaultStats = [
    {
        id: 'orders',
        label: 'Total Orders',
        value: '23',
        icon: ShoppingBag,
        bgColor: 'bg-primary/10 dark:bg-primary/20',
        iconColor: 'text-primary',
    },
    {
        id: 'savings',
        label: 'Total Savings',
        value: '₹2,340',
        icon: PiggyBank,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-600',
    },
    {
        id: 'food',
        label: 'Food Saved',
        value: '12.5 kg',
        icon: Utensils,
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600',
    },
    {
        id: 'impact',
        label: 'Impact',
        value: '2.3 trees',
        icon: TreePine,
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-600',
    },
];

function StatsRow({ stats = defaultStats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.id}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default StatsRow;
