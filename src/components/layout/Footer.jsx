import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, Leaf } from 'lucide-react';

function Footer() {
    const navigate = useNavigate();

    const handleNavClick = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-50 dark:bg-[#0f0a19] border-t border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/60">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-3">
                            <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15 p-1.5 text-primary">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">
                                <span className="text-primary">Food</span><span className="text-gray-900 dark:text-white">Index</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 dark:text-white/40">
                            Save surplus food, save money, save the planet.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-4">Explore</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <button onClick={() => handleNavClick('/marketplace')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Marketplace
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavClick('/marketplace')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Browse Deals
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* For You */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-4">For You</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <button onClick={() => handleNavClick('/dashboard')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    My Account
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavClick('/cart')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Cart
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavClick('/dashboard')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Order History
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-4">Business</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <button onClick={() => handleNavClick('/business/register')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Sell with Us
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavClick('/business')} className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Seller Dashboard
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200 dark:border-white/[0.06]">
                    <p className="text-sm text-gray-400 dark:text-white/30">
                        © {new Date().getFullYear()} FoodIndex. All rights reserved.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors group"
                    >
                        <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                        Back to top
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
