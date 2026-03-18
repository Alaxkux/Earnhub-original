const express = require('express')
const router  = express.Router()
const crypto  = require('crypto')
const User    = require('../models/User')

const SECRET_HASH = process.env.CPX_SECURITY_HASH

router.get('/postback', async (req, res) => {
  const { status, trans_id, user_id, amount_usd, hash } = req.query

  // Verify the hash - makes sure request is really from CPX
  const expectedHash = crypto
    .createHash('md5')
    .update(`${trans_id}-${SECRET_HASH}`)
    .digest('hex')

  if (hash !== expectedHash) {
    console.warn('CPX postback: invalid hash', { trans_id, user_id })
    return res.status(403).send('Invalid hash')
  }

  try {
    if (status === '1') {
      // Survey completed - credit user's balance
      await User.findByIdAndUpdate(user_id, {
        $inc: { balance: parseFloat(amount_usd) }
      })
      console.log(`✅ CPX: credited $${amount_usd} to user ${user_id}`)
    }

    if (status === '2') {
      // Reversed/fraud - deduct the amount back
      await User.findByIdAndUpdate(user_id, {
        $inc: { balance: -parseFloat(amount_usd) }
      })
      console.log(`⚠️ CPX: reversed $${amount_usd} from user ${user_id}`)
    }

    res.send('OK')
  } catch (err) {
    console.error('CPX postback error:', err)
    res.status(500).send('Error')
  }
})

module.exports = router