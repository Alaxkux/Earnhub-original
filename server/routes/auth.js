const express = require('express')
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

/* ── Helper: sign JWT ── */
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/* ── Helper: build safe user response ── */
function userResponse(user) {
  return {
    _id:              user._id,
    name:             user.name,
    email:            user.email,
    balance:          user.balance,
    coins:            user.coins,
    streak:           user.streak,
    dailyGoal:        user.dailyGoal,
    lastBonusClaimed: user.lastBonusClaimed,
    createdAt:        user.createdAt,
  }
}

/* ──────────────────────────────────────────
   POST /api/auth/register
────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const user  = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({ token, user: userResponse(user) })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ message: messages[0] })
    }
    console.error('[register]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ──────────────────────────────────────────
   POST /api/auth/login
────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Need password field back — it's excluded by default
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Reset daily earned if it's a new day
    user.resetDailyEarnedIfNeeded()
    await user.save()

    const token = signToken(user._id)
    res.json({ token, user: userResponse(user) })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ──────────────────────────────────────────
   GET /api/auth/me  (protected)
   Returns the currently logged-in user
────────────────────────────────────────── */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.resetDailyEarnedIfNeeded()
    await user.save()

    res.json({ user: userResponse(user) })
  } catch (err) {
    console.error('[me]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
