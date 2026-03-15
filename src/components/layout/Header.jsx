import { useLocation, useNavigate } from 'react-router-dom'
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

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'
  const page = PAGE_TITLES[location.pathname] || { title: 'EarnHub', subtitle: '' }

  return (
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

        {/* Profile avatar + logout */}
        <div className="header__profile">
          <div className="header__avatar" title={user?.name || 'Profile'}>
            <span>{initials}</span>
          </div>
          <button className="header__logout btn btn--ghost" onClick={handleLogout} title="Sign out">
            ⏻
          </button>
        </div>
      </div>
    </header>
  )
}
