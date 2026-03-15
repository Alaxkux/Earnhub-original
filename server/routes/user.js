const express = require('express')
const User    = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

/* ──────────────────────────────────────────
   PATCH /api/user/goal
   Update daily goal target
────────────────────────────────────────── */
router.patch('/goal', async (req, res) => {
  try {
    const target = parseFloat(req.body.target)
    if (isNaN(target) || target <= 0) {
      return res.status(400).json({ message: 'Target must be a positive number' })
    }

    const user = await User.findById(req.user._id)
    user.dailyGoal.target = +target.toFixed(2)
    await user.save()

    res.json({ dailyGoal: user.dailyGoal })
  } catch (err) {
    console.error('[update goal]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ──────────────────────────────────────────
   POST /api/user/bonus
   Claim daily bonus — once per calendar day
────────────────────────────────────────── */
router.post('/bonus', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const user  = await User.findById(req.user._id)

    if (user.lastBonusClaimed === today) {
      return res.status(409).json({ message: 'Bonus already claimed today' })
    }

    user.coins            += 20
    user.streak           += 1
    user.lastBonusClaimed  = today
    await user.save()

    res.json({
      coins:            user.coins,
      streak:           user.streak,
      lastBonusClaimed: user.lastBonusClaimed,
    })
  } catch (err) {
    console.error('[claim bonus]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ──────────────────────────────────────────
   PATCH /api/user/profile
   Update name or password
────────────────────────────────────────── */
router.patch('/profile', async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    if (name) {
      user.name = name.trim()
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new one' })
      }
      const valid = await user.comparePassword(currentPassword)
      if (!valid) {
        return res.status(401).json({ message: 'Current password is incorrect' })
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' })
      }
      user.password = newPassword // pre-save hook will hash it
    }

    await user.save()

    res.json({
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.error('[update profile]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
