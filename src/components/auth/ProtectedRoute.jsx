import { Navigate } from 'react-router-dom'
import { useAuth }   from '../../context/AuthContext'

/**
 * Wraps a route — redirects to /login if user is not authenticated.
 * Shows nothing while the auth state is loading (token check).
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: 'DM Sans, sans-serif',
        color: '#94A3B8', fontSize: '14px', gap: '10px',
      }}>
        <span style={{ fontSize: '20px' }}>◎</span> Loading EarnHub...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
