const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'prepaid'],
    default: 'credit'
  },
  limit: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Number, // Day of month (1-31)
    min: 1,
    max: 31
  },
  closingDate: {
    type: Number, // Day of month (1-31)
    min: 1,
    max: 31
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
cardSchema.index({ userId: 1 });

module.exports = mongoose.model('Card', cardSchema);
