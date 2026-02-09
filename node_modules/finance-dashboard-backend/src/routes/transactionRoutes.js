const express = require('express');
const auth = require('../middleware/authMiddleware'); // Use the centralized middleware
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const router = express.Router();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, type, startDate, endDate } = req.query;

    let query = { userId: req.userId };

    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name color')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { year, month } = req.query;

    const date = new Date();
    const currentYear = year ? parseInt(year) : date.getFullYear();
    // month is 1-based in the request, but 0-based in JavaScript's Date
    const currentMonth = month ? parseInt(month) - 1 : date.getMonth(); 

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
      if (item._id === 'income') {
        totalIncome = item.total;
      } else if (item._id === 'expense') {
        totalExpense = item.total;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      startDate,
      endDate
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly stats (income/expenses/investments)
router.get('/stats/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (!parsedMonth || !parsedYear || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);

    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const investmentCategories = await Category.find({
      userId: userObjectId,
      name: /investiment/i
    }).select('_id');

    const investmentCategoryIds = investmentCategories.map(c => c._id);

    const notInvestmentExpr = investmentCategoryIds.length
      ? { $not: [{ $in: ['$category', investmentCategoryIds] }] }
      : true;

    const [summary] = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$type', 'income'] }, notInvestmentExpr] },
                { $abs: '$amount' },
                0
              ]
            }
          },
          totalExpenses: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$type', 'expense'] }, notInvestmentExpr] },
                { $abs: '$amount' },
                0
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalInvestments = 0;
    if (investmentCategoryIds.length > 0) {
      const [investments] = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startDate, $lte: endDate },
            category: { $in: investmentCategoryIds }
          }
        },
        {
          $group: {
            _id: null,
            totalInvestments: { $sum: { $abs: '$amount' } }
          }
        }
      ]);
      totalInvestments = investments?.totalInvestments || 0;
    }

    const totalIncome = summary?.totalIncome || 0;
    const totalExpenses = summary?.totalExpenses || 0;
    const count = summary?.count || 0;
    const netBalance = totalIncome - totalExpenses;
    const netBalanceAfterInvestments = netBalance - totalInvestments;

    res.json({
      month: parsedMonth,
      year: parsedYear,
      startDate,
      endDate,
      totalIncome,
      totalExpenses,
      totalInvestments,
      netBalance,
      netBalanceAfterInvestments,
      count
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single transaction
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('category', 'name color');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const { amount, description, category, type, date } = req.body;

    const transaction = new Transaction({
      amount,
      description,
      category,
      type,
      date: date || new Date(),
      userId: req.userId
    });

    await transaction.save();
    await transaction.populate('category', 'name color');

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, description, category, type, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { amount, description, category, type, date },
      { new: true }
    ).populate('category', 'name color');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
