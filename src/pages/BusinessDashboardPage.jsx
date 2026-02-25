import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Bell, User, Store, ChevronRight, Calendar, ChevronDown, LayoutDashboard, Package, ShoppingCart, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import BusinessMetrics from '../components/business/BusinessMetrics';
import InventoryTable from '../components/business/InventoryTable';
import AddItemButton from '../components/business/AddItemButton';
import AddItemModal from '../components/business/AddItemModal';
import SellerOrders from '../components/business/SellerOrders';

const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
];

function BusinessDashboardPage() {
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleItemAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <BusinessMetrics />
                        <InventoryTable refreshKey={refreshKey} />
                    </>
                );
            case 'inventory':
                return <InventoryTable refreshKey={refreshKey} />;
            case 'orders':
                return <SellerOrders />;
            default:
                return null;
        }
    };

    const storeName = user?.name || 'My Store';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Store className="w-5 h-5" />
                    </div>
                    <Link to="/" className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                        <span className="text-primary">Food</span>Index
                    </Link>
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md">
                        Seller
                    </span>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button className="flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-56 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 gap-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1200px] mx-auto w-full">
                    {/* Mobile Tabs */}
                    <div className="flex lg:hidden gap-1 mb-6 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-white dark:bg-slate-700 text-primary shadow-sm font-bold'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Dashboard Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                                {storeName}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                <span>Dashboard</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-primary capitalize">{activeTab}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                <Calendar className="w-4 h-4" />
                                <span>Today</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <AddItemButton onClick={() => setIsModalOpen(true)} />
                        </div>
                    </div>

                    {/* Tab Content */}
                    {renderTabContent()}
                </main>
            </div>

            <Footer />

            {/* Add Item Modal */}
            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onItemAdded={handleItemAdded}
                token={user?.token}
            />
        </div>
    );
}

export default BusinessDashboardPage;
