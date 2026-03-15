import { useEffect }            from 'react'
import { useEarnings }          from '../hooks/useEarnings'
import WeeklyChart              from '../components/analytics/WeeklyChart'
import PlatformBreakdown        from '../components/analytics/PlatformBreakdown'
import StatsCard                from '../components/dashboard/StatsCard'
import './AnalyticsPage.css'

export default function AnalyticsPage() {
  const { balance, history, analytics, fetchAnalytics } = useEarnings()

  useEffect(() => { fetchAnalytics() }, [])

  const totalTasks = history.length
  const avgPerTask = totalTasks > 0 ? (balance / totalTasks).toFixed(2) : '0.00'
  const bestDay    = analytics.weeklyEarnings.reduce(
    (best, d) => d.amount > best.amount ? d : best,
    { date: '—', amount: 0 }
  )

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Understand your earning patterns and performance.</p>
      </div>

      {/* Summary stats */}
      <div className="grid-3 analytics-page__stats">
        <StatsCard label="Total Earned"    value={`$${balance.toFixed(2)}`} accent="blue"  icon="◈" />
        <StatsCard label="Tasks Completed" value={totalTasks}               accent="green" icon="✓" />
        <StatsCard label="Avg per Task"    value={`$${avgPerTask}`}         accent="yellow" icon="◎" />
      </div>

      {/* Charts */}
      <div className="analytics-page__charts">
        <WeeklyChart data={analytics.weeklyEarnings} />
        <PlatformBreakdown data={analytics.platformBreakdown} />
      </div>
    </div>
  )
}
