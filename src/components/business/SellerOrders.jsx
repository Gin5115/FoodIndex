import { useState, useEffect } from 'react';
import { Loader2, Package, CheckCircle, Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function SellerOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user?.token) return;
        try {
            const response = await fetch('http://localhost:5000/api/orders/seller-orders', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            const updated = await response.json();
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status } : o));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Placed':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    text: 'text-blue-700 dark:text-blue-400',
                    border: 'border-blue-200 dark:border-blue-800/30',
                    icon: Clock,
                    nextAction: 'Mark as Ready',
                    nextStatus: 'Ready',
                };
            case 'Ready':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    text: 'text-amber-700 dark:text-amber-400',
                    border: 'border-amber-200 dark:border-amber-800/30',
                    icon: Package,
                    nextAction: 'Mark Complete',
                    nextStatus: 'Completed',
                };
            case 'Completed':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    text: 'text-green-700 dark:text-green-400',
                    border: 'border-green-200 dark:border-green-800/30',
                    icon: CheckCircle,
                    nextAction: null,
                    nextStatus: null,
                };
            default:
                return {
                    bg: 'bg-gray-50 dark:bg-gray-800',
                    text: 'text-gray-600 dark:text-gray-400',
                    border: 'border-gray-200 dark:border-gray-700',
                    icon: Clock,
                    nextAction: null,
                    nextStatus: null,
                };
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading orders...
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                <div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">Incoming Orders</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage and fulfill customer orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {orders.filter(o => o.status === 'Placed').length} pending
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {orders.length} total
                    </span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                    <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Orders will appear here once customers start buying</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const config = getStatusConfig(order.status);
                        const StatusIcon = config.icon;

                        return (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {order.status}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>

                                        {/* Customer */}
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                            Customer: <strong>{order.user?.name || 'Unknown'}</strong>
                                            {order.user?.email && (
                                                <span className="text-gray-400 ml-1">({order.user.email})</span>
                                            )}
                                        </p>

                                        {/* Items */}
                                        <div className="flex flex-wrap gap-2">
                                            {order.orderItems.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    {item.name} × {item.qty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price + Action */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            ₹{order.totalPrice}
                                        </span>

                                        {config.nextAction && (
                                            <button
                                                onClick={() => handleStatusUpdate(order._id, config.nextStatus)}
                                                disabled={updatingId === order._id}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm shadow-primary/20"
                                            >
                                                {updatingId === order._id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-3 h-3" />
                                                )}
                                                {config.nextAction}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SellerOrders;
