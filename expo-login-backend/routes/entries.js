const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();

router.get('/', async (req, res) => {
  const { date, timeSlot } = req.query;

  let query = {};
  if (date) query.date = date;
  if (timeSlot) query.timeSlot = timeSlot;

  const entries = await Entry.find(query).sort({ date: -1 });
  res.json(entries);
});

router.post('/', async (req, res) => {
  try {
    const entry = await Entry.create(req.body);
    return res.status(201).json(entry);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This phone number already has a booking',
      });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/check-phone/:phone', async (req, res) => {
  try {
    const exists = await Entry.exists({ phone: req.params.phone });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

router.delete('/:id', async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
