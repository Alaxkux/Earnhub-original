import { formatDate, formatTime } from '../../utils/helpers'
import './HistoryList.css'

const PROVIDER_COLORS = {
  'CPX Research':  'blue',
  'AdGate Media':  'green',
  'OfferToro':     'yellow',
}

/**
 * HistoryList
 * @param {{ items: Array<{ id, title, provider, reward, completedAt }>, limit? }} props
 */
export default function HistoryList({ items = [], limit }) {
  const displayed = limit ? items.slice(0, limit) : items

  // Group by date
  const groups = {}
  displayed.forEach(item => {
    const date = formatDate(item.completedAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  })

  if (displayed.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty__icon">≡</div>
        <p>No completed tasks yet.</p>
        <p>Head to Offers to start earning.</p>
      </div>
    )
  }

  return (
    <div className="history-list">
      {Object.entries(groups).map(([date, tasks]) => (
        <div key={date} className="history-group">
          <div className="history-group__date">
            {date}
            <span className="history-group__count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="history-group__items">
            {tasks.map(task => {
              const accent = PROVIDER_COLORS[task.provider] || 'blue'
              return (
                <div key={task.id} className="history-item">
                  <div className={`history-item__dot history-item__dot--${accent}`} />
                  <div className="history-item__info">
                    <div className="history-item__title">{task.title}</div>
                    <div className="history-item__meta">
                      <span className={`badge badge--${accent}`}>{task.provider}</span>
                      <span className="history-item__time">{formatTime(task.completedAt)}</span>
                    </div>
                  </div>
                  <div className="history-item__reward">+${task.reward.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
