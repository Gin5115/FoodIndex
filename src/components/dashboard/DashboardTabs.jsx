import { UtensilsCrossed, History, Heart, Settings } from 'lucide-react';

const tabs = [
    { id: 'active', label: 'Active Orders', icon: UtensilsCrossed },
    { id: 'history', label: 'Order History', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
];

function DashboardTabs({ activeTab, onTabChange }) {
    return (
        <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export default DashboardTabs;
