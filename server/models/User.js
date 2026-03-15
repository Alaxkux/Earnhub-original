const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [60, 'Name too long'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false, // never return password in queries by default
    },

    // Earnings
    balance: { type: Number, default: 0, min: 0 },
    coins:   { type: Number, default: 0, min: 0 },
    streak:  { type: Number, default: 0, min: 0 },

    // Daily goal
    dailyGoal: {
      target: { type: Number, default: 5.00 },
      earned: { type: Number, default: 0 },
      date:   { type: String, default: '' }, // YYYY-MM-DD of last reset
    },

    // Daily bonus cooldown
    lastBonusClaimed: { type: String, default: null }, // YYYY-MM-DD
  },
  { timestamps: true }
)

/* ── Hash password before save ── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

/* ── Compare password method ── */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

/* ── Auto-reset daily earned if it's a new day ── */
userSchema.methods.resetDailyEarnedIfNeeded = function () {
  const today = new Date().toISOString().slice(0, 10)
  if (this.dailyGoal.date !== today) {
    this.dailyGoal.earned = 0
    this.dailyGoal.date   = today
  }
}

module.exports = mongoose.model('User', userSchema)
