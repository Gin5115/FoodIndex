import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import UserDashboardPage from './pages/UserDashboardPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import SellerSignupPage from './pages/SellerSignupPage';
import NotFoundPage from './pages/NotFoundPage';
import StyleGuide from './pages/StyleGuide';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FoodProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2500,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '12px 20px',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <MarketplacePage />
                </ProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <ProtectedRoute>
                  <ProductDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/business" element={
                <ProtectedRoute sellerOnly={true}>
                  <BusinessDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/business/register" element={<SellerSignupPage />} />

              <Route path="/styleguide" element={<StyleGuide />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </FoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
