import './StatsCard.css'

/**
 * StatsCard
 * @param {{ label, value, sub, accent, icon }} props
 */
export default function StatsCard({ label, value, sub, accent = 'blue', icon }) {
  return (
    <div className={`stats-card stats-card--${accent}`}>
      <div className="stats-card__header">
        <span className="stats-card__label">{label}</span>
        {icon && <span className="stats-card__icon">{icon}</span>}
      </div>
      <div className="stats-card__value">{value}</div>
      {sub && <div className="stats-card__sub">{sub}</div>}
    </div>
  )
}
