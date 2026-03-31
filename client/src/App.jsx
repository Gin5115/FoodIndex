import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MarketplacePage from './pages/MarketplacePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import BuyerDashboardPage from './pages/BuyerDashboardPage'
import SellerDashboardPage from './pages/SellerDashboardPage'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import SellerProfilePage from './pages/SellerProfilePage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/sellers/:id" element={<SellerProfilePage />} />
                <Route
                  path="/cart"
                  element={<ProtectedRoute><CartPage /></ProtectedRoute>}
                />
                <Route
                  path="/order-confirmation/:id"
                  element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute><BuyerDashboardPage /></ProtectedRoute>}
                />
                <Route
                  path="/dashboard/business"
                  element={<ProtectedRoute sellerOnly><SellerDashboardPage /></ProtectedRoute>}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
