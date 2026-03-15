import NotifPanel from '../components/notifications/NotifPanel'

export default function NotificationsPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Alerts</h1>
        <p>Notifications about new offers, completions, and bonuses.</p>
      </div>
      <NotifPanel />
    </div>
  )
}
