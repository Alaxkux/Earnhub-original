import { useEarnings } from '../../hooks/useEarnings'
import './StreakBadge.css'

/**
 * StreakBadge + Daily Bonus Claim button
 * Button is disabled if bonus already claimed today.
 */
export default function StreakBadge() {
  const { streak, coins, claimDailyBonus, canClaimBonus } = useEarnings()

  return (
    <div className="streak-badge card">
      <div className="streak-badge__flame">🔥</div>
      <div className="streak-badge__info">
        <div className="streak-badge__count">{streak} day streak</div>
        <div className="streak-badge__sub">Coins: {coins.toLocaleString()}</div>
      </div>
      <button
        className={`btn streak-badge__btn ${canClaimBonus ? 'btn--primary' : 'btn--ghost'}`}
        onClick={claimDailyBonus}
        disabled={!canClaimBonus}
        title={canClaimBonus ? 'Claim your daily bonus' : 'Already claimed today'}
      >
        {canClaimBonus ? '+20 coins' : '✓ Claimed'}
      </button>
    </div>
  )
}
