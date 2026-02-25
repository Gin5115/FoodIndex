import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Chrome, Facebook } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/marketplace');
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Enter your details to access your account</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-gray-400 dark:text-slate-500 w-5 h-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-[#171022] border border-gray-300 dark:border-slate-700/50 rounded-lg sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-gray-400 dark:text-slate-500 w-5 h-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#171022] border border-gray-300 dark:border-slate-700/50 rounded-lg sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-800/50"
                                    />
                                    <label className="ml-2 block text-sm text-gray-600 dark:text-slate-300" htmlFor="remember-me">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg shadow-primary/25 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.01]"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>

                        {/* Footer / Sign Up Link */}
                        <div className="text-center pt-2 mt-4 space-y-4">
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
                                    Sign Up
                                </Link>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                Want to sell food?{' '}
                                <Link to="/business/register" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
                                    Partner with us
                                </Link>
                            </p>
                        </div>

                        {/* Optional Social Login Divider */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-3 bg-white dark:bg-[#1f162e] text-gray-500 dark:text-slate-400 px-2">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white">
                                <Chrome className="h-5 w-5 mr-2 text-gray-500" />
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white">
                                <Facebook className="h-5 w-5 mr-2 text-blue-600" />
                                <span className="text-sm font-medium">Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
