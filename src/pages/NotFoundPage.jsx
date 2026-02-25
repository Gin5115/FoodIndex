import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';

function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[#0f0a19] flex flex-col items-center justify-center px-6 text-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-10 group">
                <div className="flex items-center justify-center rounded-lg bg-primary/15 p-2 text-primary group-hover:bg-primary/25 transition-colors">
                    <Leaf className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                    <span className="text-primary">Food</span>Index
                </span>
            </Link>

            {/* 404 Visual */}
            <div className="relative mb-8">
                <h1 className="text-[120px] sm:text-[160px] font-black text-white/[0.04] leading-none select-none">
                    404
                </h1>
                <p className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                    Page Not Found
                </p>
            </div>

            <p className="text-white/40 text-base max-w-md mb-10 leading-relaxed">
                Oops — looks like this deal expired. The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                    to="/"
                    className="flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
                <Link
                    to="/marketplace"
                    className="flex items-center gap-2 h-11 px-6 rounded-full bg-white/[0.08] text-white/80 text-sm font-medium hover:bg-white/[0.14] hover:text-white transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Browse Marketplace
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
