const express = require('express');
const router = express.Router();
const MoodBoard = require('../models/MoodBoard');
const auth = require('../middleware/authMiddleware');

// Get all moodboards for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's moodboard
    const todayMoodBoard = await MoodBoard.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get past moodboards (excluding today)
    const pastMoodBoards = await MoodBoard.find({
      user: req.user.id,
      date: { $lt: today }
    }).sort({ date: -1 }).limit(30); // Limit to last 30 entries

    res.json({
      today: todayMoodBoard,
      past: pastMoodBoards
    });
  } catch (error) {
    console.error('Error fetching moodboards:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new moodboard
router.post('/', auth, async (req, res) => {
  try {
    const { emojis, imageUrl, colorTheme, note } = req.body;

    // Validate required fields
    if (!emojis || !note) {
      return res.status(400).json({ 
        message: 'Emojis and note are required' 
      });
    }

    // Check if user already has a moodboard for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingMoodBoard = await MoodBoard.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingMoodBoard) {
      return res.status(400).json({ 
        message: 'You can only create one moodboard per day' 
      });
    }

    // Create new moodboard
    const moodBoard = new MoodBoard({
      user: req.user.id,
      emojis,
      imageUrl: imageUrl || '',
      colorTheme: colorTheme || '#667eea',
      note
    });

    await moodBoard.save();

    res.status(201).json(moodBoard);
  } catch (error) {
    console.error('Error creating moodboard:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You can only create one moodboard per day' 
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific moodboard by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const moodBoard = await MoodBoard.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!moodBoard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    res.json(moodBoard);
  } catch (error) {
    console.error('Error fetching moodboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a moodboard (only if it's from today)
router.put('/:id', auth, async (req, res) => {
  try {
    const { emojis, imageUrl, colorTheme, note } = req.body;

    const moodBoard = await MoodBoard.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!moodBoard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    // Check if it's from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (moodBoard.date < today || moodBoard.date >= tomorrow) {
      return res.status(400).json({ 
        message: 'You can only update today\'s moodboard' 
      });
    }

    // Update fields
    if (emojis !== undefined) moodBoard.emojis = emojis;
    if (imageUrl !== undefined) moodBoard.imageUrl = imageUrl;
    if (colorTheme !== undefined) moodBoard.colorTheme = colorTheme;
    if (note !== undefined) moodBoard.note = note;

    await moodBoard.save();
    res.json(moodBoard);
  } catch (error) {
    console.error('Error updating moodboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a moodboard (only if it's from today)
router.delete('/:id', auth, async (req, res) => {
  try {
    const moodBoard = await MoodBoard.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!moodBoard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    // Check if it's from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (moodBoard.date < today || moodBoard.date >= tomorrow) {
      return res.status(400).json({ 
        message: 'You can only delete today\'s moodboard' 
      });
    }

    await moodBoard.deleteOne();
    res.json({ message: 'Moodboard deleted successfully' });
  } catch (error) {
    console.error('Error deleting moodboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 