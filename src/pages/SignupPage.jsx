import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Leaf, Facebook, Chrome } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const res = await register(name, email, password);
        if (res.success) {
            navigate('/marketplace');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#171022] text-slate-900 dark:text-white font-display min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
                {/* Purple Glow Effect - Subtle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Main Content Container */}
                <div className="relative z-10 w-full max-w-md">

                    {/* Glassmorphism Card */}
                    <div className="bg-white/80 dark:bg-[#1f162e]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 shadow-xl rounded-2xl p-8 w-full animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Join the food rescue revolution</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Full Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-gray-400 dark:text-slate-500 w-5 h-5" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#171022] border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-gray-400 dark:text-slate-500 w-5 h-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#171022] border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="password">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-gray-400 dark:text-slate-500 w-5 h-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#171022] border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-gray-400 dark:text-slate-500 w-5 h-5" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#171022] border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.01]"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="mt-6 flex items-center">
                            <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Or sign up with</span>
                            <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                        </div>

                        {/* Social Login */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex justify-center items-center px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-[#171022] text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" type="button">
                                <Chrome className="h-5 w-5 mr-2 text-gray-500" />
                                Google
                            </button>
                            <button className="flex justify-center items-center px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-[#171022] text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" type="button">
                                <Facebook className="h-5 w-5 mr-2 text-blue-600" />
                                Facebook
                            </button>
                        </div>

                        {/* Footer Text */}
                        <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
