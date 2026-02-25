import Footer from '../components/layout/Footer';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader';
import FoodGrid from '../components/marketplace/FoodGrid';

function MarketplacePage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
            <MarketplaceHeader />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FoodGrid />
            </main>
            <Footer />
        </div>
    );
}

export default MarketplacePage;
