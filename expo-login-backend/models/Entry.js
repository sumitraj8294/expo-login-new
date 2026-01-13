const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    gender: String,
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);
