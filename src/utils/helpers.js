/**
 * EarnHub Utility Helpers
 */

/**
 * Format a number as USD currency string
 * @param {number} amount
 * @param {boolean} showSign — prepend + for positive values
 * @returns {string} e.g. "$1.80" or "+$1.80"
 */
export function formatCurrency(amount, showSign = false) {
  const formatted = `$${Math.abs(amount).toFixed(2)}`
  if (showSign && amount > 0) return `+${formatted}`
  return formatted
}

/**
 * Format an ISO date string to a readable date
 * @param {string} iso
 * @returns {string} e.g. "Jun 14, 2024"
 */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  })
}

/**
 * Format an ISO date string to time
 * @param {string} iso
 * @returns {string} e.g. "2:35 PM"
 */
export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
  })
}

/**
 * Human-readable time ago
 * @param {string} iso
 * @returns {string} e.g. "3m ago"
 */
export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/**
 * Clamp a number between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Returns today's date as an ISO date string (YYYY-MM-DD)
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Generate a simple unique ID
 * @param {string} prefix
 * @returns {string}
 */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}
