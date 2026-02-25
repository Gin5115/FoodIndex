import { MapPin, Zap, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFood } from '../../context/FoodContext';
import { useState } from 'react';

function Hero() {
    const { detectLocation } = useFood();
    const navigate = useNavigate();
    const [isDetecting, setIsDetecting] = useState(false);

    const handleFindDeals = async () => {
        setIsDetecting(true);
        try {
            await detectLocation();
            navigate('/marketplace');
        } catch (error) {
            console.error("Location detection failed, proceeding anyway", error);
            navigate('/marketplace');
        } finally {
            setIsDetecting(false);
        }
    };

    const avatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCo5cTiLjQTb9_kIkb7rSXWELmj5pl5cqX0ebXC9d69m3N0W_SQd1Zr0YzZk7MqskoqmNrOM63VkoJvSTYSZiif2EDBNBOl_IiNy0IeAEh6zv6DZl9_YPQDywgEVvT2OIN-MbDTRXQy5F7cFfrrIXUYTlml3M5icMIHghGZlRGUIldDZAda727zvxc6RH_njsRaiowajMeZnONoERBx6sa27Rf9WlFN8-exESAgTdMZXMele3GaI0LHGymw5lkisL3b2MxitabcPT_E",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4JZF9hJqpPleqGYG7JTIPoTgnHJhONAR5AwzqEUAPNmDAN2R_EIBYjgSTGrsSjmxK5LtDjNS64NkCoZz46jhnH618-aeS1RVuNH3buIzMuf9XsZ6ZR-inwvliND1h8A_iDclOllmB-cdTiwsy_8oiij9E_9IUhgGe9_1rm_wg4QgC2hM4E-Uj-0P_6iBntEaJcOCtPO-Xcr9VZYTZyCLrQtQwEbf-g4Ur0eKeKspbI3vEL7oobCoQn_b-QiPP6EqPAR4gcQK-qM7Z",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrY37hmvH7Y5ow9KKTyG7Yfj9Hha_BIThasB2V6euuC3FjoReoiBH_umRvhkkmTHnCtwnYRDU1I-dCkLK8FO0c4p61vHbHNjXziEXdW3zpM8V7jHu8EZ70tprqxPiG1DQcwYwrtLGn9Mywy0ApO6A0aMtK2ddxqt9aNAvH_Fh95wvEMo3YcJj-awHCQaFC7Yx--XkRVWcXyyTDa6FV4N60GlZSDbS6mD06-VeLRNJq9hVV5nbcs-mpctmm0m2Dxzg4O3cTPSSaRXfk"
    ];

    return (
        <section className="relative overflow-hidden bg-[#F9FAFB] dark:bg-background-dark pt-12 pb-20 lg:pt-24 lg:pb-32 px-4">
            <div className="mx-auto max-w-[1200px] w-full">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Content (60%) */}
                    <div className="lg:col-span-7 flex flex-col gap-8 text-center lg:text-left">
                        <div className="flex flex-col gap-4">
                            {/* Live Badge */}
                            <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                                <Zap className="w-3.5 h-3.5" />
                                <span>Live Marketplace</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-[#0d121c] dark:text-white text-4xl lg:text-[56px] font-extrabold leading-[1.1] tracking-[-0.033em]">
                                Fresh Food, <br />
                                <span className="text-primary">Falling Prices</span>
                            </h1>

                            {/* Description */}
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Connect with local bakeries and restaurants to rescue delicious, unsold food at a fraction of the cost. Save money, save the planet.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <button
                                onClick={handleFindDeals}
                                disabled={isDetecting}
                                className="flex h-12 min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isDetecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                                <span>{isDetecting ? 'Locating...' : 'Find Deals Near Me'}</span>
                            </button>
                            <Link to="/business" className="flex h-12 min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#e5e7eb] bg-white dark:bg-transparent dark:border-gray-700 px-6 text-base font-bold text-[#0d121c] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span>For Businesses</span>
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {avatars.map((src, i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                                        <img alt="User" className="h-full w-full object-cover" src={src} />
                                    </div>
                                ))}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                                    +2k
                                </div>
                            </div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                <span className="text-primary font-bold">4.9/5</span> from happy food savers
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual (40%) */}
                    <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                        {/* Decorative blob background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-100 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl opacity-70 -z-10"></div>

                        <div className="relative z-10 grid gap-6">
                            {/* Card 1 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-700 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                                <div className="flex gap-4 items-center">
                                    <div className="h-20 w-20 rounded-xl bg-orange-100 flex items-center justify-center text-4xl overflow-hidden">
                                        🥐
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg dark:text-white">Chocolate Croissant</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-400 line-through text-sm">₹150</span>
                                            <span className="text-primary font-bold text-xl">₹89</span>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                                                41%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span> Ends in 2h 15m
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 (Offset) */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-700 transform translate-x-4 lg:translate-x-8 hover:translate-x-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex gap-4 items-center">
                                    <div className="h-20 w-20 rounded-xl bg-red-100 flex items-center justify-center text-4xl overflow-hidden">
                                        🍕
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg dark:text-white">Pepperoni Slice</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-400 line-through text-sm">₹200</span>
                                            <span className="text-primary font-bold text-xl">₹110</span>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                                                45%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span> Ends in 45m
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-6 -right-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-xl shadow-lg border border-slate-100 dark:border-gray-600 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    240+ Live Deals
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
