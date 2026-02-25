import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import UserProfile from '../components/dashboard/UserProfile';
import StatsRow from '../components/dashboard/StatsRow';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import ActiveOrders from '../components/dashboard/ActiveOrders';

function UserDashboardPage() {
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('active');

    // Render tab content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'active':
                return <ActiveOrders />;
            case 'history':
                return (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">No order history yet.</p>
                    </div>
                );
            case 'favorites':
                return (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">No favorites saved.</p>
                        <Link to="/marketplace" className="text-primary font-medium mt-2 inline-block hover:underline">
                            Browse Deals
                        </Link>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                                <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                                <button className="w-12 h-6 bg-primary rounded-full relative">
                                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                                <span className="text-gray-700 dark:text-gray-300">Price Alerts</span>
                                <button className="w-12 h-6 bg-primary rounded-full relative">
                                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-12 h-6 ${isDark ? 'bg-primary' : 'bg-gray-300'} rounded-full relative`}
                                >
                                    <span className={`absolute ${isDark ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-full transition-all`}></span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <ActiveOrders />;
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 py-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <Link
                        to="/marketplace"
                        className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-1.5 text-primary">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            <span className="text-primary">Food</span>Index
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <UserProfile user={user} />
                <StatsRow />
                <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
                {renderTabContent()}
            </main>

            <Footer />
        </div>
    );
}

export default UserDashboardPage;
