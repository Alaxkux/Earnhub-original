import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'

const initialState = {
  // User object
  user: null,          // ← added

  // User / wallet
  balance:     0.00,
  coins:       0,
  streak:      0,
  dailyGoal:   { target: 5.00, earned: 0.00 },

  // Offers
  offers:      [],
  offersLoading: false,
  offersError:   null,

  // Earnings history
  history:     [],

  // Notifications
  notifications: [],
  unreadCount:   0,

  // Analytics
  analytics: {
    weeklyEarnings: [],
    platformBreakdown: [],
  },

  lastBonusClaimed: null,
  sidebarOpen: true,
}

export const ACTIONS = {
  SET_USER:                'SET_USER',         // ← added
  SET_OFFERS:              'SET_OFFERS',
  SET_OFFERS_LOADING:      'SET_OFFERS_LOADING',
  SET_OFFERS_ERROR:        'SET_OFFERS_ERROR',
  LOG_TASK:                'LOG_TASK',
  CLAIM_DAILY_BONUS:       'CLAIM_DAILY_BONUS',
  ADD_NOTIFICATION:        'ADD_NOTIFICATION',
  MARK_NOTIFICATIONS_READ: 'MARK_NOTIFICATIONS_READ',
  UPDATE_ANALYTICS:        'UPDATE_ANALYTICS',
  TOGGLE_SIDEBAR:          'TOGGLE_SIDEBAR',
  LOAD_PERSISTED_STATE:    'LOAD_PERSISTED_STATE',
  SET_DAILY_GOAL_TARGET:   'SET_DAILY_GOAL_TARGET',
}

function reducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_USER:                          // ← added
      return { ...state, user: action.payload }

    case ACTIONS.LOAD_PERSISTED_STATE:
      return { ...state, ...action.payload }

    case ACTIONS.SET_OFFERS_LOADING:
      return { ...state, offersLoading: action.payload }

    case ACTIONS.SET_OFFERS_ERROR:
      return { ...state, offersError: action.payload, offersLoading: false }

    case ACTIONS.SET_OFFERS:
      return { ...state, offers: action.payload, offersLoading: false, offersError: null }

    case ACTIONS.LOG_TASK: {
      const task = action.payload
      const newBalance  = +(state.balance + task.reward).toFixed(2)
      const newEarned   = +(state.dailyGoal.earned + task.reward).toFixed(2)
      const newHistory  = [task, ...state.history]
      const analytics   = rebuildAnalytics(newHistory)
      return {
        ...state,
        balance:   newBalance,
        history:   newHistory,
        dailyGoal: { ...state.dailyGoal, earned: newEarned },
        analytics,
      }
    }

    case ACTIONS.CLAIM_DAILY_BONUS: {
      const today = new Date().toISOString().slice(0, 10)
      if (state.lastBonusClaimed === today) return state
      return {
        ...state,
        coins:            state.coins + 20,
        streak:           state.streak + 1,
        lastBonusClaimed: today,
      }
    }

    case ACTIONS.SET_DAILY_GOAL_TARGET: {
      const target = Math.max(0.01, parseFloat(action.payload) || 5.00)
      return {
        ...state,
        dailyGoal: { ...state.dailyGoal, target: +target.toFixed(2) },
      }
    }

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50),
        unreadCount:   state.unreadCount + 1,
      }

    case ACTIONS.MARK_NOTIFICATIONS_READ:
      return { ...state, unreadCount: 0 }

    case ACTIONS.UPDATE_ANALYTICS:
      return { ...state, analytics: action.payload }

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen }

    default:
      return state
  }
}

function rebuildAnalytics(history) {
  const now = new Date()
  const weeklyEarnings = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const amount = history
      .filter(t => t.completedAt?.slice(0, 10) === dateStr)
      .reduce((sum, t) => sum + t.reward, 0)
    weeklyEarnings.push({ date: dateStr, amount: +amount.toFixed(2) })
  }

  const platformMap = {}
  history.forEach(t => {
    platformMap[t.provider] = +((platformMap[t.provider] || 0) + t.reward).toFixed(2)
  })
  const platformBreakdown = Object.entries(platformMap).map(([platform, amount]) => ({ platform, amount }))

  return { weeklyEarnings, platformBreakdown }
}

const EarnHubContext = createContext(null)

export function EarnHubProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load persisted state
  useEffect(() => {
    const saved = localStorage.getItem('earnhub_state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: ACTIONS.LOAD_PERSISTED_STATE, payload: parsed })
      } catch (_) {}
    }
  }, [])

  // Fetch logged-in user on mount      ← added
  useEffect(() => {
    const token = localStorage.getItem('earnhub_token')
    if (!token) return
    authAPI.me()
      .then(data => dispatch({ type: ACTIONS.SET_USER, payload: data.user || data }))
      .catch(() => {})
  }, [])

  // Persist key state
  useEffect(() => {
    const persist = {
      balance:          state.balance,
      coins:            state.coins,
      streak:           state.streak,
      dailyGoal:        state.dailyGoal,
      lastBonusClaimed: state.lastBonusClaimed,
      history:          state.history.slice(0, 200),
      analytics:        state.analytics,
    }
    localStorage.setItem('earnhub_state', JSON.stringify(persist))
  }, [state.balance, state.coins, state.streak, state.history, state.analytics, state.dailyGoal, state.lastBonusClaimed])

  return (
    <EarnHubContext.Provider value={{ state, dispatch }}>
      {children}
    </EarnHubContext.Provider>
  )
}

export function useEarnHub() {
  const ctx = useContext(EarnHubContext)
  if (!ctx) throw new Error('useEarnHub must be used inside EarnHubProvider')
  return ctx
}