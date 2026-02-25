import { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import FoodCard from './FoodCard';
import { useFood } from '../../context/FoodContext';

function FoodGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userLocation } = useFood();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Show loading when location changes/refetches
            try {
                let url = 'http://localhost:5000/api/products';

                // If we have user location, pass it to get distance-sorted results
                if (userLocation) {
                    url += `?lat=${userLocation.lat}&lng=${userLocation.lng}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userLocation]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading fresh deals...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 font-medium">
                Error loading deals. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <FoodCard key={product._id} item={product} />
                ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center pt-8 pb-4">
                <button className="group flex items-center justify-center gap-2 rounded-full h-12 px-8 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:shadow-md transition-all font-bold text-sm">
                    Load More Deals
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}

export default FoodGrid;
