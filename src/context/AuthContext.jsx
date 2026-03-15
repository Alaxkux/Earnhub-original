import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true) // true while checking saved token

  /* ── On mount: restore session from token ── */
  useEffect(() => {
    const token = localStorage.getItem('earnhub_token')
    if (!token) {
      setLoading(false)
      return
    }
    authAPI.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('earnhub_token'))
      .finally(() => setLoading(false))
  }, [])

  /* ── Register ── */
  async function register(name, email, password) {
    const { token, user } = await authAPI.register(name, email, password)
    localStorage.setItem('earnhub_token', token)
    setUser(user)
  }

  /* ── Login ── */
  async function login(email, password) {
    const { token, user } = await authAPI.login(email, password)
    localStorage.setItem('earnhub_token', token)
    setUser(user)
  }

  /* ── Logout ── */
  function logout() {
    localStorage.removeItem('earnhub_token')
    localStorage.removeItem('earnhub_state')
    setUser(null)
  }

  /* ── Update user in state (after bonus, goal change etc.) ── */
  function updateUser(partial) {
    setUser(prev => prev ? { ...prev, ...partial } : prev)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
