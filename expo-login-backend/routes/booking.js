const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

/**
 * CREATE BOOKING
 */
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Phone or Email already exists',
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET ALL BOOKINGS (WITH FILTERS)
 */
router.get('/', async (req, res) => {
  const { date, timeSlot } = req.query;

  const filter = {};
  if (date) filter.date = date;
  if (timeSlot) filter.timeSlot = timeSlot;

  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  res.json(bookings);
});

/**
 * DELETE BOOKING
 */
router.delete('/:id', async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
