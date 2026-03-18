require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const connectDB  = require('./config/db')

// Routes
const authRoutes     = require('./routes/auth')
const earningsRoutes = require('./routes/earnings')
const userRoutes     = require('./routes/user')
const cpxRoutes      = require('./routes/cpx')

// Connect to MongoDB
connectDB()

const app = express()

/* ── Middleware ── */
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

/* ── Routes ── */
app.use('/api/auth',     authRoutes)
app.use('/api/earnings', earningsRoutes)
app.use('/api/user',     userRoutes)
app.use('/api/cpx',      cpxRoutes)

/* ── Health check ── */
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

/* ── 404 handler ── */
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
})

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error('[unhandled error]', err)
  res.status(500).json({ message: 'Internal server error' })
})

/* ── Start ── */
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 EarnHub server running on http://localhost:${PORT}`)
})