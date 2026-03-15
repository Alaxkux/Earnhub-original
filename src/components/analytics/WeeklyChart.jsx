import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import './WeeklyChart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

/**
 * WeeklyChart
 * @param {{ data: Array<{ date: string, amount: number }> }} props
 */
export default function WeeklyChart({ data = [] }) {
  const labels = data.map(d => {
    const date = new Date(d.date + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  })

  const amounts = data.map(d => d.amount)
  const total   = amounts.reduce((s, a) => s + a, 0).toFixed(2)

  const chartData = {
    labels,
    datasets: [
      {
        data:            amounts,
        fill:            true,
        tension:         0.4,
        borderColor:     '#2563EB',
        borderWidth:     2,
        backgroundColor: 'rgba(37,99,235,0.08)',
        pointBackgroundColor: '#2563EB',
        pointBorderColor:     '#FFFFFF',
        pointBorderWidth:     2,
        pointRadius:     4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor:      '#94A3B8',
        bodyColor:       '#FFFFFF',
        padding:         10,
        cornerRadius:    8,
        callbacks: {
          label: ctx => ` $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: { color: '#94A3B8', font: { size: 11 }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid:  { color: '#F1F5F9' },
        ticks: {
          color: '#94A3B8',
          font:  { size: 11, family: 'DM Mono' },
          callback: v => `$${v}`,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="weekly-chart card">
      <div className="weekly-chart__header">
        <div>
          <div className="weekly-chart__title">Weekly Earnings</div>
          <div className="weekly-chart__total">${total}</div>
        </div>
        <span className="badge badge--blue">7 days</span>
      </div>
      <div className="weekly-chart__canvas-wrap">
        {data.length > 0
          ? <Line data={chartData} options={options} />
          : <div className="weekly-chart__empty">No data yet — complete tasks to see your chart.</div>
        }
      </div>
    </div>
  )
}
