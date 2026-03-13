const express = require('express');
const router = express.Router();
// correct path to controller folder (singular)
console.log('Loading controller from', '../controller/transactions');
const { getTransactions, addTransaction, deleteTransaction } = require('../controller/transactions');

router
  .route('/')
  .get(getTransactions)
  .post(addTransaction);

router
  .route('/:id')
  .delete(deleteTransaction);

module.exports = router;