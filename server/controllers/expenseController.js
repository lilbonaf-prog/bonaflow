const Expense = require('../models/Expense')

const createExpense = async (req, res) => {
  try {
    const { description, category, amount, notes } = req.body

    if (!description || amount === undefined) {
      return res.status(400).json({ message: 'Please provide a description and amount' })
    }

    const expense = await Expense.create({
      user: req.userId,
      description,
      category,
      amount,
      notes
    })

    res.status(201).json(expense)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save the expense. Please try again.' })
  }
}

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(expenses)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load expenses. Please try again.' })
  }
}

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.userId })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    const { description, category, amount, notes } = req.body

    if (description !== undefined) expense.description = description
    if (category !== undefined) expense.category = category
    if (amount !== undefined) expense.amount = amount
    if (notes !== undefined) expense.notes = notes

    await expense.save()
    res.json(expense)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to update the expense. Please try again.' })
  }
}

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to delete the expense. Please try again.' })
  }
}

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense }