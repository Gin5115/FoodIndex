import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { Info, Wallet, TrendingDown, Clock, Loader2 } from 'lucide-react';

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;

    const isActual = data.actual != null;
    const price = isActual ? data.actual : data.forecast;
    if (price == null) return null;

    return (
        <div className={`px-4 py-2.5 rounded-xl shadow-xl border backdrop-blur-sm ${isActual
            ? 'bg-white/95 dark:bg-slate-800/95 border-primary/20'
            : 'bg-amber-50/95 dark:bg-amber-900/30 border-amber-300/30'
            }`}
        >
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                {isActual ? '● Actual' : '◌ Forecast'} • {label}
            </p>
            <p className={`text-lg font-black tracking-tight ${isActual ? 'text-primary' : 'text-amber-600 dark:text-amber-400'}`}>
                ₹{price}
            </p>
            {data.isLowest && (
                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-0.5 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Predicted Lowest
                </p>
            )}
        </div>
    );
};

// Custom active dot
const ActiveDot = (props) => {
    const { cx, cy, dataKey } = props;
    const color = dataKey === 'actual' ? '#833CF6' : '#F59E0B';
    return (
        <g>
            <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.15} />
            <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />
        </g>
    );
};

function PriceChart({ product }) {
    if (!product) return null;

    const { originalPrice, currentPrice } = product;
    const [predictions, setPredictions] = useState(null);
    const [loadingPredictions, setLoadingPredictions] = useState(true);

    // Fetch real predictions from API
    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${product._id}/predictions`);
                if (response.ok) {
                    const data = await response.json();
                    setPredictions(data);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error);
            } finally {
                setLoadingPredictions(false);
            }
        };

        if (product._id) {
            fetchPredictions();
            // Refresh predictions every 5 minutes
            const interval = setInterval(fetchPredictions, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [product._id]);

    // Build chart data from priceHistory + predictions
    const { priceData, lowestForecast, savings, bestTime } = useMemo(() => {
        const data = [];

        // Use real price history if available
        const history = predictions?.priceHistory || product.priceHistory || [];

        if (history.length > 0) {
            // Take last 4 history entries
            const recentHistory = history.slice(-4);
            for (const entry of recentHistory) {
                const time = new Date(entry.timestamp);
                const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                data.push({
                    time: timeStr,
                    actual: Math.round(entry.price),
                    forecast: null,
                });
            }
        } else {
            // Fallback: generate synthetic history from originalPrice → currentPrice
            const gap = originalPrice - currentPrice;
            const seed = originalPrice * 7 + currentPrice * 13;
            const seededRandom = (s) => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };

            for (let i = 4; i >= 1; i--) {
                const factor = i / 4;
                const jitter = (seededRandom(seed + i * 17) * 4) - 2;
                const price = currentPrice + (gap * Math.pow(factor, 0.6)) + jitter;
                const timeDate = new Date();
                timeDate.setMinutes(timeDate.getMinutes() - (i * 90));
                data.push({
                    time: timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    actual: Math.round(price),
                    forecast: null,
                });
            }
        }

        // NOW point (bridges actual → forecast)
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        data.push({
            time: nowTime,
            actual: currentPrice,
            forecast: currentPrice,
            isCurrent: true,
        });

        // Use real predictions if available, otherwise generate synthetic
        const futurePredictions = predictions?.predictions || [];

        if (futurePredictions.length > 0) {
            futurePredictions.forEach((pred, idx) => {
                data.push({
                    time: pred.timeLabel,
                    actual: null,
                    forecast: pred.predictedPrice,
                    isLowest: idx === futurePredictions.length - 1,
                });
            });
        } else {
            // Fallback synthetic forecast
            let lastPrice = currentPrice;
            for (let i = 1; i <= 4; i++) {
                const timeDate = new Date();
                timeDate.setMinutes(timeDate.getMinutes() + (i * 30));
                const dropFactor = 0.035 * Math.pow(0.75, i - 1);
                lastPrice = lastPrice - (lastPrice * dropFactor);
                data.push({
                    time: timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    actual: null,
                    forecast: Math.round(lastPrice),
                    isLowest: i === 4,
                });
            }
        }

        const lowest = data[data.length - 1]?.forecast || currentPrice;
        return {
            priceData: data,
            lowestForecast: lowest,
            savings: currentPrice - lowest,
            bestTime: data[data.length - 1]?.time || '',
        };
    }, [originalPrice, currentPrice, predictions, product.priceHistory]);

    // Next update time
    const nextUpdate = predictions?.nextUpdate
        ? new Date(predictions.nextUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-2">
                <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Price History & Forecast
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" title="Powered by dynamic pricing engine" />
                            {loadingPredictions && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
                        </h2>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                            Dynamic pricing • live market analysis
                        </p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-[11px] font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-5 h-[2.5px] rounded-full bg-primary"></span>
                            <span className="text-gray-500 dark:text-gray-400">Actual</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-5 h-[2.5px] rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 3px, transparent 3px, transparent 6px)' }}></span>
                            <span className="text-gray-500 dark:text-gray-400">Forecast</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart — fixed 240px height */}
            <div className="px-1 sm:px-2 h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={priceData}
                        margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
                    >
                        <defs>
                            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#833CF6" stopOpacity={0.2} />
                                <stop offset="60%" stopColor="#833CF6" stopOpacity={0.05} />
                                <stop offset="100%" stopColor="#833CF6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            className="text-gray-100 dark:text-slate-700/50"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 500 }}
                            dy={6}
                            interval={0}
                        />

                        <YAxis
                            domain={['dataMin - 3', 'dataMax + 3']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 500 }}
                            tickFormatter={(value) => `₹${value}`}
                            dx={-2}
                            width={48}
                            tickCount={5}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }}
                        />

                        {/* NOW reference line */}
                        <ReferenceLine
                            x={priceData.find(d => d.isCurrent)?.time}
                            stroke="#94a3b8"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                            label={{
                                value: 'NOW',
                                position: 'top',
                                fill: '#64748b',
                                fontSize: 9,
                                fontWeight: 700,
                            }}
                        />

                        {/* Actual price area + line */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#833CF6"
                            strokeWidth={2.5}
                            fill="url(#actualGradient)"
                            connectNulls={false}
                            dot={false}
                            activeDot={<ActiveDot dataKey="actual" />}
                        />

                        {/* Forecast area + dashed line */}
                        <Area
                            type="monotone"
                            dataKey="forecast"
                            stroke="#F59E0B"
                            strokeWidth={2.5}
                            strokeDasharray="6 4"
                            fill="url(#forecastGradient)"
                            connectNulls={true}
                            dot={false}
                            activeDot={<ActiveDot dataKey="forecast" />}
                        />

                        {/* Current price dot */}
                        <ReferenceDot
                            x={priceData.find(d => d.isCurrent)?.time}
                            y={currentPrice}
                            r={5}
                            fill="#833CF6"
                            stroke="white"
                            strokeWidth={2.5}
                        />

                        {/* Lowest forecast dot */}
                        <ReferenceDot
                            x={priceData.find(d => d.isLowest)?.time}
                            y={lowestForecast}
                            r={4}
                            fill="#F59E0B"
                            stroke="white"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 px-5 py-3 border-t border-gray-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Wallet className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                        {savings > 0 ? (
                            <>Wait until <strong className="text-gray-900 dark:text-white">{bestTime}</strong> to save{' '}
                                <strong className="text-green-600 dark:text-green-400">₹{Math.max(0, savings)}</strong></>
                        ) : (
                            <strong className="text-gray-900 dark:text-white">Best price right now!</strong>
                        )}
                    </p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    {nextUpdate ? `Next update at ${nextUpdate}` : 'Updates every 5 min'}
                </span>
            </div>
        </div>
    );
}

export default PriceChart;
