const mongoose = require('mongoose');

const moodBoardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emojis: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  colorTheme: {
    type: String,
    required: true,
    default: '#667eea'
  },
  note: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure only one moodboard per user per day
moodBoardSchema.index({ user: 1, date: 1 }, { unique: true });

// Pre-save middleware to set the date to start of day
moodBoardSchema.pre('save', function(next) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  this.date = today;
  next();
});

module.exports = mongoose.model('MoodBoard', moodBoardSchema); 