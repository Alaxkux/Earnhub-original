import { useEarnHub, ACTIONS } from '../context/EarnHubContext'
import { useAuth }             from '../context/AuthContext'
import { earningsAPI, userAPI } from '../services/api'

/**
 * useEarnings
 *
 * Bridge between the UI and the backend.
 * - All writes go to the API first, then update local context on success.
 * - Analytics are fetched from the API so the chart reflects server data.
 */
export function useEarnings() {
  const { state, dispatch } = useEarnHub()
  const { user, updateUser } = useAuth()

  /**
   * Log a completed task — posts to backend, then updates local state
   * @param {{ title, provider, reward, transactionId?, completedAt? }} task
   */
  async function logTask(task) {
    try {
      const { task: saved, balance, dailyGoal } = await earningsAPI.logTask(task)

      // Update auth user balance + daily goal
      updateUser({ balance, dailyGoal })

      // Add to local history list
      dispatch({
        type: ACTIONS.LOG_TASK,
        payload: {
          id:          saved._id,
          title:       saved.title,
          provider:    saved.provider,
          reward:      saved.reward,
          completedAt: saved.completedAt,
        },
      })
    } catch (err) {
      console.error('[logTask]', err.message)
      throw err
    }
  }

  /**
   * Claim daily bonus — hits backend (server enforces once/day)
   */
  async function claimDailyBonus() {
    try {
      const { coins, streak, lastBonusClaimed } = await userAPI.claimBonus()
      updateUser({ coins, streak, lastBonusClaimed })
      dispatch({ type: ACTIONS.CLAIM_DAILY_BONUS }) // keeps local coin display in sync
    } catch (err) {
      // 409 = already claimed today — silently ignore
      if (err.status !== 409) console.error('[claimDailyBonus]', err.message)
    }
  }

  /**
   * Update daily goal target
   */
  async function setDailyGoalTarget(value) {
    try {
      const { dailyGoal } = await userAPI.updateGoal(value)
      updateUser({ dailyGoal })
      dispatch({ type: ACTIONS.SET_DAILY_GOAL_TARGET, payload: value })
    } catch (err) {
      console.error('[setDailyGoalTarget]', err.message)
      throw err
    }
  }

  /**
   * Fetch task history from backend and populate local context
   */
  async function fetchHistory(page = 1) {
    try {
      const { tasks, pagination } = await earningsAPI.getTasks(page)
      if (page === 1) {
        dispatch({ type: ACTIONS.SET_OFFERS_LOADING, payload: false })
        // Replace history with fresh server data on first page load
        tasks.forEach(t => {
          dispatch({
            type: ACTIONS.LOG_TASK,
            payload: {
              id:          t._id,
              title:       t.title,
              provider:    t.provider,
              reward:      t.reward,
              completedAt: t.completedAt,
            },
          })
        })
      }
      return { tasks, pagination }
    } catch (err) {
      console.error('[fetchHistory]', err.message)
      throw err
    }
  }

  /**
   * Fetch analytics from backend
   */
  async function fetchAnalytics() {
    try {
      const analytics = await earningsAPI.getAnalytics()
      dispatch({ type: ACTIONS.UPDATE_ANALYTICS, payload: analytics })
      return analytics
    } catch (err) {
      console.error('[fetchAnalytics]', err.message)
    }
  }

  // Pull live values from auth user (server source of truth) with context fallback
  const balance  = user?.balance  ?? state.balance
  const coins    = user?.coins    ?? state.coins
  const streak   = user?.streak   ?? state.streak
  const dailyGoal = user?.dailyGoal ?? state.dailyGoal

  const goalPercent = dailyGoal.target > 0
    ? Math.min(100, Math.round((dailyGoal.earned / dailyGoal.target) * 100))
    : 0

  const today = new Date().toISOString().slice(0, 10)
  const canClaimBonus = user?.lastBonusClaimed !== today

  return {
    balance,
    coins,
    streak,
    dailyGoal,
    goalPercent,
    history:       state.history,
    analytics:     state.analytics,
    canClaimBonus,
    logTask,
    claimDailyBonus,
    setDailyGoalTarget,
    fetchHistory,
    fetchAnalytics,
  }
}
