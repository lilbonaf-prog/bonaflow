const mongoose = require('mongoose')
const Sale = require('../models/Sale')
const Product = require('../models/Product')

const createSale = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const { customer, items, paymentMethod, notes } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Please add at least one product to the sale' })
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Please select a payment method' })
    }

    let total = 0
    const saleItems = []

    await session.withTransaction(async () => {
      for (const item of items) {
        const product = await Product.findOne({ _id: item.productId, user: req.userId }).session(session)

        if (!product) {
          throw new Error(`Product not found`)
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}. Only ${product.quantity} left.`)
        }

        saleItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.sellingPrice
        })

        total += product.sellingPrice * item.quantity

        product.quantity -= item.quantity
        await product.save({ session })
      }

      await Sale.create([{
        user: req.userId,
        customer: customer || null,
        items: saleItems,
        total,
        paymentMethod,
        notes
      }], { session })
    })

    res.status(201).json({ message: 'Sale recorded successfully' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message || 'Unable to record the sale. Please try again.' })
  } finally {
    session.endSession()
  }
}

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.userId })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 })
    res.json(sales)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load sales. Please try again.' })
  }
}

module.exports = { createSale, getSales }