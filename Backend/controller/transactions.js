const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// In-memory store used when MongoDB is not connected.
const inMemoryTransactions = global.inMemoryTransactions || [];

const isMongoConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      return res.status(200).json({
        success: true,
        count: inMemoryTransactions.length,
        data: inMemoryTransactions
      });
    }

    const transactions = await Transaction.find();

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    console.error('Get Transactions Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Public
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount } = req.body;

    if (!text || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide text and amount'
      });
    }

    if (!isMongoConnected()) {
      const newTransaction = {
        _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text,
        amount: Number(amount),
        createdAt: new Date()
      };

      inMemoryTransactions.push(newTransaction);

      return res.status(201).json({
        success: true,
        data: newTransaction
      });
    }

    const transaction = await Transaction.create(req.body);
  
    return res.status(201).json({
      success: true,
      data: transaction
    }); 
  } catch (err) {
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Add Transaction Error:', err);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const index = inMemoryTransactions.findIndex(t => t._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'No transaction found'
        });
      }

      inMemoryTransactions.splice(index, 1);

      return res.status(200).json({
        success: true,
        data: {}
      });
    }

    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    await Transaction.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.error('Delete Transaction Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
}