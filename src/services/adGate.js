/**
 * AdGate Media Integration
 * Docs: https://adgatemedia.com/publishers/
 *
 * AdGate provides an offerwall via iframe embed + postMessage callbacks.
 *
 * Required env vars:
 *   VITE_ADGATE_APP_ID
 *   VITE_APP_USER_ID
 */

const APP_ID  = import.meta.env.VITE_ADGATE_APP_ID
const USER_ID = import.meta.env.VITE_APP_USER_ID

export const ADGATE_PROVIDER = 'AdGate Media'

/**
 * Build AdGate offerwall embed URL
 * @returns {string|null}
 */
export function getAdGateOfferwallURL() {
  if (!APP_ID || !USER_ID) {
    console.warn('[AdGate] Missing VITE_ADGATE_APP_ID or VITE_APP_USER_ID in .env')
    return null
  }

  const params = new URLSearchParams({
    user_id: USER_ID,
    sub_id:  'earnhub',
  })

  return `https://wall.adgaterewards.com/${APP_ID}?${params.toString()}`
}

/**
 * AdGate postMessage completion listener
 * @param {function} onComplete
 * @returns {function} cleanup
 */
export function listenForAdGateCompletion(onComplete) {
  function handler(event) {
    if (!event.origin.includes('adgaterewards.com') && !event.origin.includes('adgatemedia.com')) return

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      if (data?.event === 'offer_completed' || data?.type === 'conversion') {
        onComplete({
          reward:        parseFloat(data.payout || data.reward || data.amount || 0),
          transactionId: data.transaction_id || data.conversion_id || null,
          title:         data.offer_name || data.title || 'Task',
          provider:      ADGATE_PROVIDER,
          completedAt:   new Date().toISOString(),
        })
      }
    } catch (_) {}
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}
