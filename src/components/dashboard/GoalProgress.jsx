import './GoalProgress.css'

/**
 * GoalProgress
 * Shows daily earning goal as a progress bar
 */
export default function GoalProgress({ earned, target, percent }) {
  return (
    <div className="goal-progress card">
      <div className="goal-progress__header">
        <div>
          <span className="goal-progress__label">Daily Goal</span>
          <span className="goal-progress__percent">{percent}%</span>
        </div>
        <div className="goal-progress__amounts">
          <span className="goal-progress__earned">${earned.toFixed(2)}</span>
          <span className="goal-progress__sep"> / </span>
          <span className="goal-progress__target">${target.toFixed(2)}</span>
        </div>
      </div>

      <div className="goal-progress__track">
        <div
          className="goal-progress__fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <p className="goal-progress__note">
        {percent >= 100
          ? '🎉 Goal reached! Keep going.'
          : `$${(target - earned).toFixed(2)} more to reach today's goal`}
      </p>
    </div>
  )
}
