import { useEffect }   from 'react'
import { useEarnings } from '../hooks/useEarnings'
import { useAuth }     from '../context/AuthContext'
import StatsCard     from '../components/dashboard/StatsCard'
import GoalProgress  from '../components/dashboard/GoalProgress'
import StreakBadge   from '../components/dashboard/StreakBadge'
import HistoryList   from '../components/history/HistoryList'
import './DashboardPage.css'

export default function DashboardPage() {
  const { balance, coins, streak, dailyGoal, goalPercent, history, fetchHistory, fetchAnalytics } = useEarnings()
  const { user } = useAuth()

  useEffect(() => {
    fetchHistory(1)
    fetchAnalytics()
  }, [])

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayEarnings = history
    .filter(t => t.completedAt?.slice(0, 10) === todayStr)
    .reduce((s, t) => s + t.reward, 0)
    .toFixed(2)

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="page-header">
        <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
        <p>Here's your earning summary for today.</p>
      </div>

      {/* Stats row */}
      <div className="grid-4 dashboard__stats">
        <StatsCard
          label="Total Balance"
          value={`$${balance.toFixed(2)}`}
          sub="All-time earnings"
          accent="blue"
          icon="◈"
        />
        <StatsCard
          label="Today's Earnings"
          value={`$${todayEarnings}`}
          sub="Tasks completed today"
          accent="green"
          icon="◎"
        />
        <StatsCard
          label="Coins"
          value={coins.toLocaleString()}
          sub="Internal reward points"
          accent="yellow"
          icon="◉"
        />
        <StatsCard
          label="Day Streak"
          value={`${streak} days`}
          sub="Keep it going!"
          accent="red"
          icon="🔥"
        />
      </div>

      {/* Goal + Streak row */}
      <div className="grid-2 dashboard__mid">
        <GoalProgress
          earned={dailyGoal.earned}
          target={dailyGoal.target}
          percent={goalPercent}
        />
        <StreakBadge />
      </div>

      {/* Recent history */}
      <div className="dashboard__recent">
        <div className="dashboard__section-header">
          <h2>Recent Activity</h2>
          <a href="/history" className="dashboard__see-all">View all →</a>
        </div>
        <HistoryList items={history} limit={5} />
      </div>
    </div>
  )
}
