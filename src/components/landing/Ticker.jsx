import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';

// Fallback data if API fails
const fallbackItems = [
    { name: 'Chocolate Croissant', oldPrice: 150, newPrice: 89, discount: 41 },
    { name: 'Pepperoni Pizza', oldPrice: 200, newPrice: 110, discount: 45 },
    { name: 'Sourdough Loaf', oldPrice: 250, newPrice: 125, discount: 50 },
    { name: 'Sushi Platter', oldPrice: 500, newPrice: 250, discount: 50 },
    { name: 'Iced Latte', oldPrice: 180, newPrice: 120, discount: 33 },
];

function TickerItem({ name, oldPrice, newPrice, discount }) {
    return (
        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
            <Tag className="w-4 h-4 text-primary" />
            {name} ₹{oldPrice}
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-primary">₹{newPrice}</span>
            <span className="text-success font-bold bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs">
                ↓{discount}%
            </span>
        </span>
    );
}

function Ticker() {
    const [tickerItems, setTickerItems] = useState(fallbackItems);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                // Try live-drops endpoint first (dynamic pricing data)
                let response = await fetch('http://localhost:5000/api/products/ticker/live-drops');
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const formattedData = data.map(item => ({
                            name: item.name,
                            oldPrice: item.originalPrice,
                            newPrice: item.currentPrice,
                            discount: item.discount,
                        }));
                        setTickerItems(formattedData);
                        setLoading(false);
                        return;
                    }
                }

                // Fallback to regular ticker
                response = await fetch('http://localhost:5000/api/products/ticker');
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const formattedData = data.map(item => ({
                            name: item.name,
                            oldPrice: item.originalPrice,
                            newPrice: item.currentPrice,
                            discount: Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100),
                        }));
                        setTickerItems(formattedData);
                    }
                }
            } catch (error) {
                console.log('Using fallback ticker data');
            } finally {
                setLoading(false);
            }
        };

        fetchTickerData();

        // Refresh every 30 seconds for live price drops
        const interval = setInterval(fetchTickerData, 30 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Double the items for seamless infinite scroll
    const allItems = [...tickerItems, ...tickerItems];

    return (
        <div className="w-full bg-purple-50 dark:bg-slate-800/80 border-y border-primary/10 dark:border-slate-700 overflow-hidden py-3">
            <div className="relative w-full flex overflow-x-hidden group">
                <motion.div
                    className="flex gap-8 px-4 items-center"
                    animate={{
                        x: ['0%', '-50%'],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 30,
                            ease: 'linear',
                        },
                    }}
                    whileHover={{ animationPlayState: 'paused' }}
                >
                    {allItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-8">
                            <TickerItem {...item} />
                            <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default Ticker;
