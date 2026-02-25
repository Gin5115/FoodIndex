import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, User, Mail, Lock, Phone, MapPin, Loader, CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';

function SellerSignupPage() {
    // Stage 1: Account Info, Stage 2: Business Info
    const [step, setStep] = useState(1);

    // Account State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Business State
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('Restaurant');
    const [businessAddress, setBusinessAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState(null); // { lat, lng }
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const { register, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleNextStep = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setStep(2);
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: 'Detected Location' // Ideally reverse geocode here, but optional for now
                });
                setIsDetectingLocation(false);
                toast.success('Location detected!');
            },
            (error) => {
                console.error(error);
                toast.error('Unable to retrieve your location');
                setIsDetectingLocation(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location) {
            toast.error('Please detect your business location');
            return;
        }

        const sellerData = {
            businessName,
            businessType,
            businessAddress,
            phone,
            location
        };

        const res = await register(name, email, password, 'seller', sellerData);

        if (res.success) {
            toast.success('Seller account created! Welcome aboard.');
            navigate('/business');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#171022] text-slate-900 dark:text-white font-display min-h-screen flex flex-col transition-colors duration-200">
            <Navbar />

            <div className="flex-1 flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-2xl">
                    <div className="bg-white/80 dark:bg-[#1f162e]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 shadow-2xl rounded-2xl p-8 md:p-10 animate-fade-in-up">

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Partner with FoodIndex</h2>
                            <p className="mt-2 text-gray-600 dark:text-slate-400">Reduce waste, increase revenue, and help your community.</p>

                            {/* Steps Indicator */}
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <span className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-white/20'}`}></span>
                                <span className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-white/20'}`}></span>
                            </div>
                        </div>

                        {authError && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg text-sm text-center">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
                            {/* ── STEP 1: ACCOUNT INFO ──────────────── */}
                            {step === 1 && (
                                <div className="space-y-5 animate-fade-in">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2 mb-4">Account Details</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Owner Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                placeholder="you@business.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Confirm Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98] mt-4"
                                    >
                                        Next Step
                                    </button>
                                </div>
                            )}

                            {/* ── STEP 2: BUSINESS INFO ──────────────── */}
                            {step === 2 && (
                                <div className="space-y-5 animate-fade-in">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2 flex items-center gap-1"
                                    >
                                        ← Back to Account Info
                                    </button>

                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2 mb-4">Business Profile</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Business Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Store className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                placeholder="Joe's Bakery"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Business Type</label>
                                            <select
                                                className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                                                value={businessType}
                                                onChange={(e) => setBusinessType(e.target.value)}
                                            >
                                                <option>Restaurant</option>
                                                <option>Bakery</option>
                                                <option>Café</option>
                                                <option>Grocery</option>
                                                <option>Cloud Kitchen</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Business Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                                placeholder="123 Main St, City"
                                                value={businessAddress}
                                                onChange={(e) => setBusinessAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Location Detector */}
                                    <div className="pt-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">GPS Location (Required for Discovery)</label>
                                        <button
                                            type="button"
                                            onClick={detectLocation}
                                            disabled={isDetectingLocation || location}
                                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 border rounded-xl text-sm font-medium transition-all ${location
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 cursor-default'
                                                    : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {isDetectingLocation ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" /> Detecting...
                                                </>
                                            ) : location ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4" /> Location Captured
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="w-4 h-4" /> Detect My Shop Location
                                                </>
                                            )}
                                        </button>
                                        {location && (
                                            <p className="text-xs text-green-600 dark:text-green-400 text-center mt-2">
                                                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98] mt-4"
                                    >
                                        Create Seller Account
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                Sign in
                            </Link>
                        </p>
                        <p className="mt-2 text-gray-600 dark:text-slate-400">
                            Looking to buy food?{' '}
                            <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                Create a buyer account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerSignupPage;
