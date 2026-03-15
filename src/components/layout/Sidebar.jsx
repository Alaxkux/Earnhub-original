import { NavLink }    from 'react-router-dom'
import { useEarnHub, ACTIONS } from '../../context/EarnHubContext'
import { useAuth }    from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',  icon: '⬡' },
  { to: '/offers',     label: 'Offers',     icon: '◈' },
  { to: '/analytics',  label: 'Analytics',  icon: '◎' },
  { to: '/history',    label: 'History',    icon: '≡' },
  { to: '/notifications', label: 'Alerts',  icon: '◉' },
  { to: '/settings',   label: 'Settings',   icon: '◌' },
]

export default function Sidebar() {
  const { state } = useEarnHub()
  const { user }  = useAuth()
  const { unreadCount } = useNotifications()

  const balance = user?.balance ?? state.balance
  const coins   = user?.coins   ?? state.coins

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-mark">
          <span>E</span>
        </div>
        <span className="sidebar__logo-text">EarnHub</span>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
            }
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            <span className="sidebar__nav-label">{item.label}</span>
            {item.to === '/notifications' && unreadCount > 0 && (
              <span className="sidebar__badge">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Balance pill at bottom */}
      <div className="sidebar__footer">
        {user?.name && (
          <div className="sidebar__user">{user.name}</div>
        )}
        <div className="sidebar__balance">
          <span className="sidebar__balance-label">Balance</span>
          <span className="sidebar__balance-amount">
            ${balance.toFixed(2)}
          </span>
        </div>
        <div className="sidebar__coins">
          <span className="sidebar__coins-icon">◈</span>
          <span className="sidebar__coins-count">{coins.toLocaleString()} coins</span>
        </div>
      </div>
    </aside>
  )
}
