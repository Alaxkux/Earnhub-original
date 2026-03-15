import { useEarnHub, ACTIONS } from '../context/EarnHubContext'

/**
 * useNotifications
 */
export function useNotifications() {
  const { state, dispatch } = useEarnHub()

  function addNotification({ title, message, type = 'info' }) {
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      payload: {
        id:        `notif_${Date.now()}`,
        title,
        message,
        type,      // 'info' | 'success' | 'warning'
        createdAt: new Date().toISOString(),
      },
    })
  }

  function markAllRead() {
    dispatch({ type: ACTIONS.MARK_NOTIFICATIONS_READ })
  }

  return {
    notifications: state.notifications,
    unreadCount:   state.unreadCount,
    addNotification,
    markAllRead,
  }
}
