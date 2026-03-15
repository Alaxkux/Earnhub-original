import './PlatformBreakdown.css'

const PLATFORM_COLORS = {
  'CPX Research':  '#2563EB',
  'AdGate Media':  '#10B981',
  'OfferToro':     '#F59E0B',
}

/**
 * PlatformBreakdown
 * @param {{ data: Array<{ platform, amount }> }} props
 */
export default function PlatformBreakdown({ data = [] }) {
  const total = data.reduce((s, d) => s + d.amount, 0)

  const sorted = [...data].sort((a, b) => b.amount - a.amount)

  return (
    <div className="platform-breakdown card">
      <div className="platform-breakdown__header">
        <div className="platform-breakdown__title">Platform Performance</div>
        <span className="platform-breakdown__total mono">${total.toFixed(2)} total</span>
      </div>

      {sorted.length === 0 ? (
        <div className="platform-breakdown__empty">No earnings recorded yet.</div>
      ) : (
        <div className="platform-breakdown__list">
          {sorted.map(item => {
            const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0
            const color = PLATFORM_COLORS[item.platform] || '#94A3B8'
            return (
              <div key={item.platform} className="platform-breakdown__item">
                <div className="platform-breakdown__item-header">
                  <div className="platform-breakdown__dot" style={{ background: color }} />
                  <span className="platform-breakdown__name">{item.platform}</span>
                  <span className="platform-breakdown__amount mono">${item.amount.toFixed(2)}</span>
                  <span className="platform-breakdown__pct">{pct}%</span>
                </div>
                <div className="platform-breakdown__track">
                  <div
                    className="platform-breakdown__fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
