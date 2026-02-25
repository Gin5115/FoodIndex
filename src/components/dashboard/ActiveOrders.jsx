import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Clock, Navigation, Pizza, Loader2, Package, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function ActiveOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error('Fetch orders error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    // Status badge styles
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Placed':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    text: 'text-blue-700 dark:text-blue-400',
                    dot: 'bg-blue-500',
                    ping: 'bg-blue-400',
                };
            case 'Ready':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    text: 'text-green-700 dark:text-green-400',
                    dot: 'bg-green-500',
                    ping: 'bg-green-400',
                };
            case 'Completed':
                return {
                    bg: 'bg-gray-50 dark:bg-gray-800/50',
                    text: 'text-gray-600 dark:text-gray-400',
                    dot: 'bg-gray-400',
                    ping: null,
                };
            default:
                return {
                    bg: 'bg-gray-50 dark:bg-gray-800/50',
                    text: 'text-gray-600 dark:text-gray-400',
                    dot: 'bg-gray-400',
                    ping: null,
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-500">Error loading orders: {error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                <Pizza className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                <Link to="/marketplace" className="text-primary font-medium mt-2 inline-block hover:underline">
                    Browse Market
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => {
                const statusStyles = getStatusStyles(order.status);
                const firstItem = order.orderItems[0];
                const itemCount = order.orderItems.length;
                const totalQty = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
                const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });

                return (
                    <div
                        key={order._id}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                                {firstItem?.image ? (
                                    <img
                                        src={firstItem.image}
                                        alt={firstItem.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-purple-100 dark:from-primary/30 dark:to-purple-900/40 flex items-center justify-center">
                                        <Package className="w-16 h-16 text-primary/40" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-white shadow-sm">
                                    Order #{order._id.slice(-6).toUpperCase()}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {firstItem?.name || 'Order'}
                                            </h3>
                                            {totalQty > 1 && (
                                                <span className="text-gray-400 text-sm">
                                                    x {totalQty} items
                                                </span>
                                            )}
                                        </div>
                                        {itemCount > 1 && (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                                                + {itemCount - 1} more item{itemCount - 1 > 1 ? 's' : ''}
                                            </p>
                                        )}
                                        <p className="text-gray-400 dark:text-gray-500 text-xs">
                                            {orderDate}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                                            ₹{order.totalPrice}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Footer */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-700 pt-4 mt-auto">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 ${statusStyles.bg} rounded-lg w-fit`}>
                                            <span className="relative flex h-2.5 w-2.5">
                                                {statusStyles.ping && (
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusStyles.ping} opacity-75`}></span>
                                                )}
                                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusStyles.dot}`}></span>
                                            </span>
                                            <span className={`text-sm font-semibold ${statusStyles.text}`}>
                                                {order.status === 'Placed' ? 'Order Placed' : order.status === 'Ready' ? 'Ready for Pickup' : 'Completed'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm">
                                            View Details
                                        </button>
                                        {order.status !== 'Completed' && (
                                            <button className="flex-1 md:flex-none px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm">
                                                <Navigation className="w-4 h-4" />
                                                Get Directions
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Browse More */}
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl opacity-60">
                <Pizza className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Looking for more? Browse nearby deals.</p>
                <Link to="/marketplace" className="text-primary font-medium mt-2 inline-block hover:underline">
                    Browse Market
                </Link>
            </div>
        </div>
    );
}

export default ActiveOrders;
