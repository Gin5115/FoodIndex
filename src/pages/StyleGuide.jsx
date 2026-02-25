import { useState, useEffect } from 'react';

function StyleGuide() {
    const [inputValue, setInputValue] = useState('');
    const [isDark, setIsDark] = useState(false);

    // Apply dark class to html element
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className={`min-h-screen flex flex-col font-display selection:bg-primary/20 selection:text-primary transition-colors duration-300 ${isDark ? 'bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md px-6 py-4 transition-colors duration-300 ${isDark ? 'border-slate-800 bg-background-dark/80' : 'border-slate-200 bg-background-light/80'}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-[20px]">lunch_dining</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            FreshFinds <span className="text-slate-400 font-normal">UI Kit v1.0</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                            <span className="size-2 rounded-full bg-success animate-pulse"></span>
                            System Status: Stable
                        </div>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`flex items-center justify-center size-9 rounded-lg border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-32 h-fit">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Foundation</h3>
                            <nav className="flex flex-col space-y-1">
                                <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium" href="#typography">
                                    <span className="material-symbols-outlined text-[18px]">text_fields</span>
                                    Typography
                                </a>
                                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`} href="#colors">
                                    <span className="material-symbols-outlined text-[18px]">palette</span>
                                    Color Palette
                                </a>
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Components</h3>
                            <nav className="flex flex-col space-y-1">
                                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`} href="#buttons">
                                    <span className="material-symbols-outlined text-[18px]">smart_button</span>
                                    Buttons
                                </a>
                                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`} href="#forms">
                                    <span className="material-symbols-outlined text-[18px]">check_box</span>
                                    Forms & Inputs
                                </a>
                                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`} href="#cards">
                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                    Cards
                                </a>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-9 space-y-16">
                        {/* Intro */}
                        <section className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tight">Design Foundation</h2>
                            <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                The core visual elements that make up the FreshFinds interface. Clean typography, consistent spacing, and a vibrant color palette designed for clarity and appetite appeal.
                            </p>
                        </section>

                        <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

                        {/* Typography Section */}
                        <section className="scroll-mt-32" id="typography">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    Typography
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Inter</span>
                                </h3>
                            </div>
                            <div className={`rounded-xl border p-8 space-y-8 shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                {/* H1 */}
                                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className="text-xs font-mono text-slate-400">H1 · Bold · 32px</div>
                                    <div className="md:col-span-3">
                                        <span className="text-[32px] font-bold leading-tight">Delicious food delivered.</span>
                                    </div>
                                </div>
                                {/* H2 */}
                                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className="text-xs font-mono text-slate-400">H2 · SemiBold · 24px</div>
                                    <div className="md:col-span-3">
                                        <span className="text-[24px] font-semibold leading-tight">Popular Restaurants</span>
                                    </div>
                                </div>
                                {/* H3 */}
                                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className="text-xs font-mono text-slate-400">H3 · Medium · 20px</div>
                                    <div className="md:col-span-3">
                                        <span className="text-[20px] font-medium leading-tight">Order Summary</span>
                                    </div>
                                </div>
                                {/* Body */}
                                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className="text-xs font-mono text-slate-400">Body · Regular · 16px</div>
                                    <div className="md:col-span-3">
                                        <p className={`text-[16px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            Our partners are committed to providing the freshest ingredients and fastest delivery times in the city.
                                        </p>
                                    </div>
                                </div>
                                {/* Small */}
                                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className="text-xs font-mono text-slate-400">Small · Medium · 14px</div>
                                    <div className="md:col-span-3">
                                        <p className={`text-[14px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Already have an account? Sign in.
                                        </p>
                                    </div>
                                </div>
                                {/* Tiny */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
                                    <div className="text-xs font-mono text-slate-400">Tiny · Medium · 12px</div>
                                    <div className="md:col-span-3">
                                        <p className="text-[12px] font-medium text-slate-400 uppercase tracking-wide">
                                            Terms & Conditions Apply
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Colors Section */}
                        <section className="scroll-mt-32" id="colors">
                            <h3 className="text-2xl font-bold mb-8">Color Palette</h3>
                            <div className="space-y-8">
                                {/* Brand Colors */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Brand</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className={`p-3 rounded-xl border shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                            <div className="h-20 w-full rounded-lg bg-primary mb-3 shadow-sm"></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">Primary</span>
                                                <span className="text-xs font-mono text-slate-500">#833cf6</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl border shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                            <div className="h-20 w-full rounded-lg bg-primary/20 mb-3 shadow-sm border border-primary/20"></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">Primary Light</span>
                                                <span className="text-xs font-mono text-slate-500">20% Opacity</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Utility Colors */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Utility</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className={`p-3 rounded-xl border shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                            <div className="h-16 w-full rounded-lg bg-success mb-3 shadow-sm"></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Success</span>
                                                <span className="text-xs font-mono text-slate-500">#10B981</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl border shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                            <div className="h-16 w-full rounded-lg bg-warning mb-3 shadow-sm"></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Warning</span>
                                                <span className="text-xs font-mono text-slate-500">#F59E0B</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl border shadow-sm transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                            <div className="h-16 w-full rounded-lg bg-danger mb-3 shadow-sm"></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Danger</span>
                                                <span className="text-xs font-mono text-slate-500">#EF4444</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grayscale */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Neutrals</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                                        <div className="space-y-1">
                                            <div className="h-12 w-full rounded bg-slate-50 border border-slate-200"></div>
                                            <div className="text-xs text-center font-mono text-slate-500">50</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-12 w-full rounded bg-slate-200"></div>
                                            <div className="text-xs text-center font-mono text-slate-500">200</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-12 w-full rounded bg-slate-400"></div>
                                            <div className="text-xs text-center font-mono text-slate-500">400</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-12 w-full rounded bg-slate-600"></div>
                                            <div className="text-xs text-center font-mono text-slate-500">600</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-12 w-full rounded bg-slate-800"></div>
                                            <div className="text-xs text-center font-mono text-slate-500">800</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-12 w-full rounded bg-slate-900"></div>
                                            <div className="text-xs text-center font-mono text-slate-500">900</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Buttons Section */}
                        <section className="scroll-mt-32" id="buttons">
                            <h3 className="text-2xl font-bold mb-8">UI Components</h3>

                            <div className="mb-12">
                                <h4 className={`text-lg font-semibold mb-4 border-b pb-2 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'}`}>Buttons (8px Radius)</h4>
                                <div className={`rounded-xl border p-8 transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                        {/* Primary */}
                                        <div className="space-y-4">
                                            <span className="text-xs font-mono text-slate-400 block mb-2">Primary</span>
                                            <div className="space-y-3">
                                                <button className="btn-primary">Order Now</button>
                                                <button className="btn-primary" disabled>Disabled</button>
                                            </div>
                                        </div>
                                        {/* Secondary */}
                                        <div className="space-y-4">
                                            <span className="text-xs font-mono text-slate-400 block mb-2">Secondary</span>
                                            <div className="space-y-3">
                                                <button className="btn-secondary">View Menu</button>
                                                <button className="btn-secondary" disabled>Unavailable</button>
                                            </div>
                                        </div>
                                        {/* Tertiary */}
                                        <div className="space-y-4">
                                            <span className="text-xs font-mono text-slate-400 block mb-2">Tertiary</span>
                                            <div className="space-y-3">
                                                <button className="btn-tertiary">
                                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                                    Go Back
                                                </button>
                                                <button className="btn-tertiary" disabled>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Elements */}
                            <div className="mb-12 scroll-mt-32" id="forms">
                                <h4 className={`text-lg font-semibold mb-4 border-b pb-2 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'}`}>Form Elements</h4>
                                <div className={`rounded-xl border p-8 transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        {/* Default Input */}
                                        <div className="space-y-2">
                                            <label className="input-label">Default Input</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                                </span>
                                                <input
                                                    className="input-field pl-10"
                                                    placeholder="Search for food..."
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {/* Focused Input */}
                                        <div className="space-y-2">
                                            <label className="input-label text-primary">Focused State</label>
                                            <div className="relative">
                                                <input
                                                    className={`input-field border-primary ring-1 ring-primary ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                                                    type="email"
                                                    defaultValue="user@example.com"
                                                />
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-primary">
                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                </span>
                                            </div>
                                        </div>
                                        {/* Error Input */}
                                        <div className="space-y-2">
                                            <label className="input-label text-danger">Error State</label>
                                            <input
                                                className="input-field input-error"
                                                type="password"
                                                defaultValue="wrongpass"
                                            />
                                            <p className="input-error-text">Incorrect password. Please try again.</p>
                                        </div>
                                        {/* Select */}
                                        <div className="space-y-2">
                                            <label className="input-label">Select Input</label>
                                            <select className="input-field">
                                                <option>Select City</option>
                                                <option>New York</option>
                                                <option>London</option>
                                                <option>Tokyo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Component */}
                            <div className="scroll-mt-32" id="cards">
                                <h4 className={`text-lg font-semibold mb-4 border-b pb-2 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'}`}>Card Design (12px Radius)</h4>
                                <div className={`rounded-xl border p-8 lg:p-12 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="max-w-sm mx-auto card-product group">
                                        {/* Card Image */}
                                        <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                                            <img
                                                alt="Juicy double cheeseburger"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvK6uZi_GuwweVOQODVSTTkC6y7Yt45GWLWTMJXDA5oDUUVQH_NxwL5R1OiBQjNJulSdzPHjJLFnFUKytmQ7yRtZqmDYcfllR_NA5YbJxBxF70NkjAMJwQiGd29xv3bJXoCNpbKenQ85jLAWG5oO624MGX68nZtMpmJFQGbDhz1MKzO0q-tQo58ebNoATuPwZWmhnESjptndctwNTxTJAiFMyokU2Qwz3o8grIH5tF4W9V3IwqostmhBfzvSjEskdVsD67M08Aw_IA"
                                            />
                                            <div className={`absolute top-3 left-3 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${isDark ? 'bg-slate-900/90 text-white' : 'bg-white/90 text-slate-900'}`}>
                                                <span className="material-symbols-outlined text-[14px] text-warning">star</span>
                                                4.8
                                            </div>
                                            <button className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${isDark ? 'bg-black/50 hover:bg-slate-700 text-white' : 'bg-white/50 hover:bg-white text-slate-600'}`}>
                                                <span className="material-symbols-outlined text-[18px]">favorite</span>
                                            </button>
                                        </div>
                                        {/* Card Content */}
                                        <div className="p-4 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold leading-tight">Double Cheeseburger</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Burger King · 15-20 min</p>
                                                </div>
                                                <span className="text-lg font-bold text-primary">$12.99</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="badge badge-success">Free Delivery</span>
                                                <span className="badge badge-neutral">Popular</span>
                                            </div>
                                            <button className="btn-primary mt-2">
                                                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`border-t py-12 mt-12 transition-colors ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="material-symbols-outlined">copyright</span>
                        <span className="text-sm">2026 FreshFinds Design System</span>
                    </div>
                    <div className="flex gap-6">
                        <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Documentation</a>
                        <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Components</a>
                        <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StyleGuide;
