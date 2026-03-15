import { useEffect, useState } from 'react'
import { useEarnings }         from '../hooks/useEarnings'
import { useAuth }             from '../context/AuthContext'
import HistoryList             from '../components/history/HistoryList'
import './HistoryPage.css'

export default function HistoryPage() {
  const { history, fetchHistory } = useEarnings()
  const { user }                  = useAuth()
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    fetchHistory(1).finally(() => setLoading(false))
  }, [])

  const balance = user?.balance ?? 0

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayTotal = history
    .filter(t => t.completedAt?.slice(0, 10) === todayStr)
    .reduce((s, t) => s + t.reward, 0)

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>History</h1>
        <p>A full log of every task you've completed.</p>
      </div>

      {/* Summary bar */}
      <div className="history-page__summary card">
        <div className="history-page__summary-item">
          <span className="history-page__summary-label">Total Tasks</span>
          <span className="history-page__summary-value mono">{history.length}</span>
        </div>
        <div className="history-page__summary-divider" />
        <div className="history-page__summary-item">
          <span className="history-page__summary-label">All-time Earned</span>
          <span className="history-page__summary-value mono">${balance.toFixed(2)}</span>
        </div>
        <div className="history-page__summary-divider" />
        <div className="history-page__summary-item">
          <span className="history-page__summary-label">Today</span>
          <span className="history-page__summary-value mono">${todayTotal.toFixed(2)}</span>
        </div>
      </div>

      {loading
        ? <div className="history-page__loading">Loading history...</div>
        : <HistoryList items={history} />
      }
    </div>
  )
}
