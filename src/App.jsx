import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EarnHubProvider } from './context/EarnHubContext'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layout
import Sidebar        from './components/layout/Sidebar'
import Header         from './components/layout/Header'
import BottomNav      from './components/layout/BottomNav'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Auth pages
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// App pages
import DashboardPage     from './pages/DashboardPage'
import OffersPage        from './pages/OffersPage'
import AnalyticsPage     from './pages/AnalyticsPage'
import HistoryPage       from './pages/HistoryPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage      from './pages/SettingsPage'
import NotFoundPage      from './pages/NotFoundPage'

/* ── App shell — only rendered when logged in ── */
function AppShell() {
  return (
    <EarnHubProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-body">
            <Routes>
              <Route path="/"              element={<DashboardPage />} />
              <Route path="/offers"        element={<OffersPage />} />
              <Route path="/analytics"     element={<AnalyticsPage />} />
              <Route path="/history"       element={<HistoryPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings"      element={<SettingsPage />} />
              <Route path="*"              element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        <BottomNav />
      </div>
    </EarnHubProvider>
  )
}

/* ── Guest guard — redirect to / if already logged in ── */
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — redirect to dashboard if already logged in */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* All other routes are protected */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
