const express = require('express')
const Task    = require('../models/Task')
const User    = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// All earnings routes require auth
router.use(protect)

/* ──────────────────────────────────────────
   POST /api/earnings/tasks
   Log a completed task
────────────────────────────────────────── */
router.post('/tasks', async (req, res) => {
  try {
    const { title, provider, reward, transactionId, completedAt } = req.body

    if (!title || !provider || reward === undefined) {
      return res.status(400).json({ message: 'title, provider and reward are required' })
    }

    const rewardNum = parseFloat(reward)
    if (isNaN(rewardNum) || rewardNum < 0) {
      return res.status(400).json({ message: 'Invalid reward value' })
    }

    // Prevent duplicate transactions from the same provider
    if (transactionId) {
      const dupe = await Task.findOne({ user: req.user._id, transactionId })
      if (dupe) {
        return res.status(409).json({ message: 'Task already logged', task: dupe })
      }
    }

    // Create task
    const task = await Task.create({
      user:          req.user._id,
      title,
      provider,
      reward:        rewardNum,
      transactionId: transactionId || null,
      completedAt:   completedAt ? new Date(completedAt) : new Date(),
    })

    // Update user balance + daily earned
    const user = await User.findById(req.user._id)
    user.balance = +(user.balance + rewardNum).toFixed(2)
    user.resetDailyEarnedIfNeeded()
    user.dailyGoal.earned = +(user.dailyGoal.earned + rewardNum).toFixed(2)
    await user.save()

    res.status(201).json({
      task,
      balance:   user.balance,
      dailyGoal: user.dailyGoal,
    })
  } catch (err) {
    console.error('[log task]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ──────────────────────────────────────────
   GET /api/earnings/tasks
   Get task history (paginated)
────────────────────────────────────────── */
router.get('/tasks', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.min(100, parseInt(req.query.limit) || 50)
    const skip  = (page - 1) * limit

    const [tasks, total] = await Promise.all([
      Task.find({ user: req.user._id })
          .sort({ completedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      Task.countDocuments({ user: req.user._id }),
    ])

    res.json({
      tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('[get tasks]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ──────────────────────────────────────────
   GET /api/earnings/analytics
   Weekly earnings + platform breakdown
────────────────────────────────────────── */
router.get('/analytics', async (req, res) => {
  try {
    // Last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const tasks = await Task.find({
      user:        req.user._id,
      completedAt: { $gte: sevenDaysAgo },
    }).lean()

    // Build weekly earnings map
    const dailyMap = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dailyMap[d.toISOString().slice(0, 10)] = 0
    }
    tasks.forEach(t => {
      const date = new Date(t.completedAt).toISOString().slice(0, 10)
      if (dailyMap[date] !== undefined) {
        dailyMap[date] = +(dailyMap[date] + t.reward).toFixed(2)
      }
    })
    const weeklyEarnings = Object.entries(dailyMap).map(([date, amount]) => ({ date, amount }))

    // Platform breakdown (all-time)
    const allTasks = await Task.find({ user: req.user._id }).lean()
    const platformMap = {}
    allTasks.forEach(t => {
      platformMap[t.provider] = +((platformMap[t.provider] || 0) + t.reward).toFixed(2)
    })
    const platformBreakdown = Object.entries(platformMap)
      .map(([platform, amount]) => ({ platform, amount }))
      .sort((a, b) => b.amount - a.amount)

    res.json({ weeklyEarnings, platformBreakdown })
  } catch (err) {
    console.error('[analytics]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
