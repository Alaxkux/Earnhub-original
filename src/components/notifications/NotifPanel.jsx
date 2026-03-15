import { useNotifications } from '../../hooks/useNotifications'
import { timeAgo } from '../../utils/helpers'
import './NotifPanel.css'

const TYPE_ICONS = {
  info:    '◉',
  success: '✓',
  warning: '◈',
}

const TYPE_ACCENT = {
  info:    'blue',
  success: 'green',
  warning: 'yellow',
}

export default function NotifPanel() {
  const { notifications, markAllRead } = useNotifications()

  return (
    <div className="notif-panel">
      <div className="notif-panel__toolbar">
        <span className="notif-panel__count">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</span>
        {notifications.length > 0 && (
          <button className="btn btn--ghost notif-panel__clear" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="notif-panel__empty">
          <div className="notif-panel__empty-icon">◉</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="notif-panel__list">
          {notifications.map(n => {
            const accent = TYPE_ACCENT[n.type] || 'blue'
            return (
              <div key={n.id} className={`notif-item notif-item--${accent}`}>
                <div className={`notif-item__icon badge badge--${accent}`}>
                  {TYPE_ICONS[n.type] || '◉'}
                </div>
                <div className="notif-item__body">
                  <div className="notif-item__title">{n.title}</div>
                  {n.message && <div className="notif-item__msg">{n.message}</div>}
                </div>
                <div className="notif-item__time">{timeAgo(n.createdAt)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
