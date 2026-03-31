import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, sellerOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (sellerOnly && !user.isSeller) return <Navigate to="/" replace />

  return children
}
