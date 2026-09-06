const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Transport', 'Rent', 'Utilities', 'Salaries', 'Stock', 'Marketing', 'Other'],
    default: 'Other'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Expense', expenseSchema)