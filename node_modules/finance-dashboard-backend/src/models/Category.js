const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: '📊'
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
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
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Category', categorySchema);
