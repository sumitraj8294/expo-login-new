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
  const entry = await Entry.create(req.body);
  res.json(entry);
});

router.delete('/:id', async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
