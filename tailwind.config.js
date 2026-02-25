/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                "primary": "#833cf6",
                "primary-hover": "#6c2bd9",

                // Background Colors
                "background-light": "#f7f5f8",
                "background-dark": "#171022",

                // Semantic Colors
                "success": "#10B981",
                "warning": "#F59E0B",
                "danger": "#EF4444",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
            },
            fontSize: {
                // Typography Scale from HTML
                'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
                'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'small': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
                'tiny': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",      // 8px - Buttons
                "xl": "0.75rem",
                "2xl": "1rem",       // 12px - Cards
                "full": "9999px",
            },
            boxShadow: {
                "soft": "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
                "primary": "0 4px 14px -2px rgba(131, 60, 246, 0.3)",
            },
        },
    },
    plugins: [],
}
