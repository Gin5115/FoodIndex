import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, Package, X, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function InventoryTable({ refreshKey }) {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch seller products
    useEffect(() => {
        fetchProducts();
    }, [user, refreshKey]);

    const fetchProducts = async () => {
        if (!user?.token) return;
        try {
            const response = await fetch('http://localhost:5000/api/products/seller', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setEditData({
            currentPrice: item.currentPrice,
            stock: item.stock,
            soldOut: item.soldOut,
        });
    };

    const handleSaveEdit = async (id) => {
        setActionLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(editData),
            });
            if (!response.ok) throw new Error('Failed to update');
            const updated = await response.json();
            setItems(prev => prev.map(item => item._id === id ? updated : item));
            setEditingId(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setActionLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!response.ok) throw new Error('Failed to delete');
            setItems(prev => prev.filter(item => item._id !== id));
            setDeleteConfirmId(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const getStockBadge = (stock, soldOut) => {
        if (soldOut || stock === 0) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
        if (stock <= 2) return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
        if (stock <= 5) return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300';
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    };

    const getStockLabel = (stock, soldOut) => {
        if (soldOut) return 'Sold Out';
        if (stock === 0) return 'Sold Out';
        return `${stock} left`;
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading inventory...
            </div>
        );
    }

    return (
        <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                <div className="flex flex-col">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">Active Items</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your current inventory listing</p>
                </div>
                <div className="relative flex-grow sm:flex-grow-0">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Search className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                        placeholder="Search items..."
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {error}
                    <button onClick={() => setError('')} className="ml-auto">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No items in your inventory</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add your first item to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 min-w-[200px]">Product</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Original</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sale Price</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Stock</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {filteredItems.map((item) => (
                                    <tr key={item._id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-5 h-5 text-primary" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 line-through text-sm">₹{item.originalPrice}</td>
                                        <td className="p-4">
                                            {editingId === item._id ? (
                                                <input
                                                    type="number"
                                                    value={editData.currentPrice}
                                                    onChange={(e) => setEditData({ ...editData, currentPrice: Number(e.target.value) })}
                                                    className="w-20 px-2 py-1 bg-gray-50 dark:bg-slate-600 border border-primary rounded text-sm text-primary font-semibold focus:outline-none"
                                                />
                                            ) : (
                                                <span className="font-semibold text-primary">₹{item.currentPrice}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingId === item._id ? (
                                                <input
                                                    type="number"
                                                    value={editData.stock}
                                                    onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                                                    className="w-16 px-2 py-1 bg-gray-50 dark:bg-slate-600 border border-primary rounded text-sm font-medium focus:outline-none dark:text-white"
                                                />
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStockBadge(item.stock, item.soldOut)}`}>
                                                    {getStockLabel(item.stock, item.soldOut)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {item.soldOut || item.stock === 0 ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 w-fit rounded-full bg-gray-100 dark:bg-slate-700">
                                                    <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Inactive</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-1 w-fit rounded-full border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                    <span className="text-xs font-medium text-red-700 dark:text-red-400">Live</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {editingId === item._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveEdit(item._id)}
                                                            disabled={actionLoading}
                                                            className="p-1.5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg text-green-600 transition-colors"
                                                            title="Save"
                                                        >
                                                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-gray-400 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : deleteConfirmId === item._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            disabled={actionLoading}
                                                            className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(null)}
                                                            className="px-2.5 py-1 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(item._id)}
                                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Item Count Footer */}
                {filteredItems.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gray-50/30 dark:bg-slate-700/20">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-bold text-gray-900 dark:text-white">{filteredItems.length}</span> of{' '}
                            <span className="font-bold text-gray-900 dark:text-white">{items.length}</span> items
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventoryTable;
