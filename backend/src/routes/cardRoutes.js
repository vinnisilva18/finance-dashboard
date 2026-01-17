const express = require('express');
const jwt = require('jsonwebtoken');
const Card = require('../models/Card');

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all cards
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.userId }).sort({ name: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single card
router.get('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create card
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, limit, balance, dueDate, closingDate } = req.body;

    const card = new Card({
      name,
      type: type || 'credit',
      limit: limit || 0,
      balance: balance || 0,
      dueDate,
      closingDate,
      userId: req.userId
    });

    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update card
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, limit, balance, dueDate, closingDate } = req.body;

    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, type, limit, balance, dueDate, closingDate },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete card
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Card deleted' });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
