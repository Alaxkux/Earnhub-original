const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    title:         { type: String, required: true, trim: true },
    provider:      { type: String, required: true, trim: true },
    reward:        { type: Number, required: true, min: 0 },
    transactionId: { type: String, default: null }, // from offerwall provider
    completedAt:   { type: Date,   default: Date.now },
  },
  { timestamps: false }
)

// Compound index — fast queries per user sorted by date
taskSchema.index({ user: 1, completedAt: -1 })

module.exports = mongoose.model('Task', taskSchema)
