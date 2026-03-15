/**
 * CPX Research Integration
 * Docs: https://publishers.cpx-research.com/
 *
 * CPX Research uses an iframe/offerwall embed model.
 * They also provide a postMessage API for tracking completions.
 *
 * Required env vars:
 *   VITE_CPX_APP_ID
 *   VITE_CPX_SECURITY_HASH  (optional, for secure mode)
 *   VITE_APP_USER_ID
 */

const APP_ID   = import.meta.env.VITE_CPX_APP_ID
const USER_ID  = import.meta.env.VITE_APP_USER_ID

export const CPX_PROVIDER = 'CPX Research'

/**
 * Build the CPX Research offerwall URL for iframe embedding
 * @param {object} options
 * @returns {string} URL
 */
export function getCPXOfferwallURL({ width = 900, height = 700 } = {}) {
  if (!APP_ID || !USER_ID) {
    console.warn('[CPX] Missing VITE_CPX_APP_ID or VITE_APP_USER_ID in .env')
    return null
  }

  const params = new URLSearchParams({
    app_id:    APP_ID,
    ext_user_id: USER_ID,
    output_method: 'iframe',
    width,
    height,
  })

  return `https://offer.cpx-research.com/index.php?${params.toString()}`
}

/**
 * CPX Research postMessage listener
 * Fires when a survey is completed inside the iframe.
 * Call this in a useEffect and return the cleanup function.
 *
 * @param {function} onComplete - called with { reward, transactionId }
 * @returns {function} cleanup
 */
export function listenForCPXCompletion(onComplete) {
  function handler(event) {
    // CPX sends messages from their domain
    if (!event.origin.includes('cpx-research.com')) return

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      if (data?.type === 'cpx_survey_completed' || data?.status === 'survey_completed') {
        onComplete({
          reward:        parseFloat(data.amount || data.earnings || 0),
          transactionId: data.transaction_id || data.id || null,
          title:         data.survey_name || 'Survey',
          provider:      CPX_PROVIDER,
          completedAt:   new Date().toISOString(),
        })
      }
    } catch (_) {}
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}
