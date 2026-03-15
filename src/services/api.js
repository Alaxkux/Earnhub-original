/**
 * EarnHub API Service
 * All HTTP calls to the Express backend go through here.
 * Token is read from localStorage on every request.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* ── Core fetch wrapper ── */
async function request(method, path, body = null) {
  const token = localStorage.getItem('earnhub_token')

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    throw err
  }

  return data
}

const get    = (path)       => request('GET',   path)
const post   = (path, body) => request('POST',  path, body)
const patch  = (path, body) => request('PATCH', path, body)

/* ── Auth ── */
export const authAPI = {
  register: (name, email, password) => post('/auth/register', { name, email, password }),
  login:    (email, password)       => post('/auth/login',    { email, password }),
  me:       ()                       => get('/auth/me'),
}

/* ── Earnings ── */
export const earningsAPI = {
  logTask:    (task)  => post('/earnings/tasks', task),
  getTasks:   (page = 1, limit = 50) => get(`/earnings/tasks?page=${page}&limit=${limit}`),
  getAnalytics: ()   => get('/earnings/analytics'),
}

/* ── User ── */
export const userAPI = {
  updateGoal:    (target)                            => patch('/user/goal',    { target }),
  claimBonus:    ()                                  => post('/user/bonus',    {}),
  updateProfile: (name, currentPassword, newPassword) =>
    patch('/user/profile', { name, currentPassword, newPassword }),
}
