import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { useAuth }           from '../../context/AuthContext'
import './Header.css'

const PAGE_TITLES = {
  '/':              { title: 'Dashboard',   subtitle: 'Your earning overview' },
  '/offers':        { title: 'Offers',      subtitle: 'Browse available tasks' },
  '/analytics':     { title: 'Analytics',   subtitle: 'Track your performance' },
  '/history':       { title: 'History',     subtitle: 'All completed tasks' },
  '/notifications': { title: 'Alerts',      subtitle: 'Stay up to date' },
  '/settings':      { title: 'Settings',    subtitle: 'Manage your account' },
}

export default function Header() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { unreadCount, markAllRead } = useNotifications()
  const { user, logout } = useAuth()

  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const [confirmOpen,   setConfirmOpen]   = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSignOutClick() {
    setDropdownOpen(false)
    setConfirmOpen(true)
  }

  function handleConfirmSignOut() {
    setConfirmOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'
  const page = PAGE_TITLES[location.pathname] || { title: 'EarnHub', subtitle: '' }

  return (
    <>
      <header className="header">
        <div className="header__left">
          <h1 className="header__title">{page.title}</h1>
          {page.subtitle && <p className="header__subtitle">{page.subtitle}</p>}
        </div>

        <div className="header__right">
          {/* Notification bell */}
          <button
            className="header__icon-btn"
            aria-label="Notifications"
            onClick={() => { markAllRead(); navigate('/notifications') }}
          >
            <span className="header__icon">◉</span>
            {unreadCount > 0 && (
              <span className="header__notif-dot">{unreadCount}</span>
            )}
          </button>

          {/* Profile avatar + dropdown */}
          <div className="header__profile" ref={dropdownRef}>
            <button
              className="header__avatar"
              onClick={() => setDropdownOpen(o => !o)}
              aria-label="Profile menu"
              title={user?.name || 'Profile'}
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="header__dropdown">
                <div className="header__dropdown-user">
                  <div className="header__dropdown-avatar">{initials}</div>
                  <div>
                    <div className="header__dropdown-name">{user?.name}</div>
                    <div className="header__dropdown-email">{user?.email}</div>
                  </div>
                </div>
                <div className="header__dropdown-divider" />
                <button
                  className="header__dropdown-item"
                  onClick={() => { setDropdownOpen(false); navigate('/settings') }}
                >
                  ◌ Settings
                </button>
                <div className="header__dropdown-divider" />
                <button
                  className="header__dropdown-item header__dropdown-item--danger"
                  onClick={handleSignOutClick}
                >
                  ⏻ Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sign out confirmation modal */}
      {confirmOpen && (
        <div className="header__modal-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="header__modal" onClick={e => e.stopPropagation()}>
            <h3 className="header__modal-title">Sign out?</h3>
            <p className="header__modal-body">Are you sure you want to sign out of EarnHub?</p>
            <div className="header__modal-actions">
              <button className="btn btn--ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button className="btn btn--primary header__modal-confirm" onClick={handleConfirmSignOut}>
                Yes, sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}