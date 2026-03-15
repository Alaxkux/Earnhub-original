import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const ITEMS = [
  { to: '/',          label: 'Home',    icon: '⬡' },
  { to: '/offers',    label: 'Offers',  icon: '◈' },
  { to: '/analytics', label: 'Stats',   icon: '◎' },
  { to: '/history',   label: 'History', icon: '≡' },
  { to: '/settings',  label: 'More',    icon: '◌' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
