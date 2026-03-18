const APP_ID = import.meta.env.VITE_CPX_APP_ID

export const CPX_PROVIDER = 'CPX Research'

export function getCPXOfferwallURL(userId, { width = 900, height = 700 } = {}) {
  if (!APP_ID || !userId) {
    console.warn('[CPX] Missing APP_ID or userId')
    return null
  }

  const params = new URLSearchParams({
    app_id:        APP_ID,
    ext_user_id:   userId,   // ← real logged-in user's MongoDB _id
    output_method: 'iframe',
    width,
    height,
  })

  return `https://offers.cpx-research.com/index.php?${params.toString()}`
}

export function listenForCPXCompletion(onComplete) {
  function handler(event) {
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