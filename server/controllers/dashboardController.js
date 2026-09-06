const Product = require('../models/Product')
const Customer = require('../models/Customer')
const Sale = require('../models/Sale')
const Expense = require('../models/Expense')

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId

    const [sales, expenses, products, customerCount] = await Promise.all([
      Sale.find({ user: userId }),
      Expense.find({ user: userId }),
      Product.find({ user: userId }),
      Customer.countDocuments({ user: userId })
    ])

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const estimatedProfit = totalSales - totalExpenses

    const lowStockProducts = products.filter((p) => p.quantity <= p.lowStockThreshold)

    const recentSales = await Sale.find({ user: userId })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5)

    const recentExpenses = await Expense.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      totalSales,
      totalExpenses,
      estimatedProfit,
      totalCustomers: customerCount,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      recentSales,
      recentExpenses
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load dashboard stats. Please try again.' })
  }
}

module.exports = { getDashboardStats }