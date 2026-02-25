import { useState, useEffect } from 'react';
import FoodCard from '../marketplace/FoodCard';
import { Loader2 } from 'lucide-react';

function TrendingGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/trending');
                if (!response.ok) {
                    throw new Error('Failed to fetch trending products');
                }
                const data = await response.json();
                setProducts(data.slice(0, 4)); // Only show top 4
            } catch (err) {
                console.error("Error fetching trending products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20 bg-white dark:bg-background-dark">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 px-4 bg-white dark:bg-background-dark">
            <div className="mx-auto max-w-[1200px]">
                <h2 className="text-[#0d121c] dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-8">
                    Trending Near You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <FoodCard key={product._id} item={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TrendingGrid;
