import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Ticker from '../components/landing/Ticker';
import TrendingGrid from '../components/landing/TrendingGrid';
import HowItWorks from '../components/landing/HowItWorks';

function LandingPage() {
    return (
        <div className="min-h-screen bg-background-light font-display">
            <Navbar />
            <main>
                <Hero />
                <Ticker />
                <TrendingGrid />
                <HowItWorks />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
