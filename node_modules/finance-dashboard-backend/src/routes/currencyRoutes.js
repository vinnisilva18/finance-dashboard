const express = require('express');
const jwt = require('jsonwebtoken');

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

// Mock currency data - In a real app, this would come from an external API
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 }
];

// Get all currencies
router.get('/', auth, async (req, res) => {
  try {
    res.json(currencies);
  } catch (error) {
    console.error('Get currencies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get currency by code
router.get('/:code', auth, async (req, res) => {
  try {
    const currency = currencies.find(c => c.code === req.params.code.toUpperCase());
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    console.error('Get currency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Convert currency
router.post('/convert', auth, async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    const fromCurrency = currencies.find(c => c.code === from.toUpperCase());
    const toCurrency = currencies.find(c => c.code === to.toUpperCase());

    if (!fromCurrency || !toCurrency) {
      return res.status(400).json({ message: 'Invalid currency codes' });
    }

    // Convert to USD first, then to target currency
    const amountInUSD = amount / fromCurrency.rate;
    const convertedAmount = amountInUSD * toCurrency.rate;

    res.json({
      from: fromCurrency,
      to: toCurrency,
      originalAmount: amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      rate: toCurrency.rate / fromCurrency.rate
    });
  } catch (error) {
    console.error('Convert currency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
