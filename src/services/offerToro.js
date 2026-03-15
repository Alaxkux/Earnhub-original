/**
 * OfferToro Integration
 * Docs: https://www.offertoro.com/publishers
 *
 * OfferToro uses iframe embed + postMessage for completion callbacks.
 *
 * Required env vars:
 *   VITE_OFFERTORO_APP_ID
 *   VITE_OFFERTORO_SECRET
 *   VITE_APP_USER_ID
 */

const APP_ID  = import.meta.env.VITE_OFFERTORO_APP_ID
const SECRET  = import.meta.env.VITE_OFFERTORO_SECRET
const USER_ID = import.meta.env.VITE_APP_USER_ID

export const OFFERTORO_PROVIDER = 'OfferToro'

/**
 * Build OfferToro offerwall embed URL
 * @returns {string|null}
 */
export function getOfferToroOfferwallURL() {
  if (!APP_ID || !USER_ID) {
    console.warn('[OfferToro] Missing VITE_OFFERTORO_APP_ID or VITE_APP_USER_ID in .env')
    return null
  }

  const params = new URLSearchParams({
    pub_id:  APP_ID,
    user_id: USER_ID,
    // secret is typically used server-side for postback verification
  })

  return `https://www.offertoro.com/ifr/show/${APP_ID}/${USER_ID}/23310`
}

/**
 * OfferToro postMessage completion listener
 * @param {function} onComplete
 * @returns {function} cleanup
 */
export function listenForOfferToroCompletion(onComplete) {
  function handler(event) {
    if (!event.origin.includes('offertoro.com')) return

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      if (data?.status === 'completed' || data?.event === 'reward') {
        onComplete({
          reward:        parseFloat(data.reward || data.amount || data.payout || 0),
          transactionId: data.oid || data.transaction_id || null,
          title:         data.offer_name || data.name || 'Offer',
          provider:      OFFERTORO_PROVIDER,
          completedAt:   new Date().toISOString(),
        })
      }
    } catch (_) {}
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}
