const mongoose = require('mongoose')
const Sale = require('../models/Sale')
const Expense = require('../models/Expense')

const getReports = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)

    let { startDate, endDate } = req.query

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30))
    const end = endDate ? new Date(endDate) : new Date()
    end.setHours(23, 59, 59, 999)

    const dateFilter = { user: userId, createdAt: { $gte: start, $lte: end } }

    const [sales, expenses] = await Promise.all([
      Sale.find(dateFilter),
      Expense.find(dateFilter)
    ])

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const estimatedProfit = totalSales - totalExpenses

    const salesByPaymentMethod = await Sale.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$paymentMethod', total: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ])

    const bestSellingProducts = await Sale.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ])

    const dailySalesTrend = await Sale.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      startDate: start,
      endDate: end,
      totalSales,
      totalExpenses,
      estimatedProfit,
      salesByPaymentMethod,
      bestSellingProducts,
      dailySalesTrend
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load reports. Please try again.' })
  }
}

module.exports = { getReports }