const express = require('express');
const User = require('../models/User');

const router = express.Router();

/**
 * GET USER BY UID
 * Used after OTP verification
 */
router.get('/user/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * REGISTER USER
 * Used for new users
 */
router.post('/register', async (req, res) => {
  // ✅ ADD HERE (FIRST LINE INSIDE THE HANDLER)
  console.log('REGISTER HIT', req.body);

  const { uid, name, email, gender, phone } = req.body;

  if (!uid || !name || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        gender,
        phone,
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;

